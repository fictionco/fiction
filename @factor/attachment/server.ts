import { EndpointMeta, ResponseType } from "@factor/endpoint/types"
import { FactorPost, PostActions } from "@factor/post/types"
import { Request, Response } from "express"
import { processEndpointRequest, endpointError } from "@factor/endpoint/server"
import { addEndpoint } from "@factor/api/endpoints"
import { applyFilters, runCallbacks } from "@factor/api/hooks"
import { objectId, postPermission, addPostSchema } from "@factor/post/util"
import { getModel } from "@factor/post/database"
import mime from "mime-types"
import multer from "multer"
import { addMiddleware } from "@factor/server/middleware"
import { Attachment } from "./types"
import storageSchema from "./schema"
import { uploadEndpointPath } from "./util"

const handleUpload = async function({
  meta
}: {
  meta: EndpointMeta;
}): Promise<ResponseType | void> {
  const { bearer, request } = meta
  const { file } = request ?? {}

  if (!bearer || !bearer._id) {
    throw endpointError("401", new Error("Not authorized to create attachment."))
  }

  if (!file) {
    throw new Error("No file uploaded.")
  }

  const { buffer, mimetype, size } = file

  const attachmentModel = getModel<Attachment>("attachment")
  const attachment = new attachmentModel()

  Object.assign(attachment, {
    author: [objectId(bearer._id)],
    mimetype,
    size
  })

  const attachmentUrl = await applyFilters("storage-attachment-url", {
    buffer,
    key: `${attachment._id}.${mime.extension(mimetype)}`,
    mimetype,
    size,
    _id: attachment._id
  })

  attachment.url =
    typeof attachmentUrl == "string"
      ? attachmentUrl
      : `data:${mimetype};base64,${buffer.toString("base64")}`

  await attachment.save()

  return attachment.toObject()
}

/**
 * Deletes and image/attachment from the DB and calls hooks for plugins to the same
 *
 * @param params._id - Post ID of the image to delete
 * @param meta.bearer - Authenticated user making the request
 */
export const deleteImage = async function(
  { _id }: { _id: string },
  { bearer }: EndpointMeta
): Promise<FactorPost | void> {
  const attachmentModel = getModel<Attachment>("attachment")
  const post = await attachmentModel.findOne({ _id })

  if (!post) return

  postPermission({ bearer, post, action: PostActions.Delete })

  await attachmentModel.deleteOne({ _id })

  if (post && !post.url.includes("base64")) {
    await runCallbacks("delete-attachment", post)
  }

  return post
}

export const setup = (): void => {
  addEndpoint({ id: "storage", handler: { deleteImage } })

  addPostSchema(() => storageSchema)

  addMiddleware({
    key: "attachment",
    path: uploadEndpointPath(),
    middleware: [
      multer().single("imageUpload"),
      async (request: Request, response: Response): Promise<void> => {
        return await processEndpointRequest({
          request,
          response,
          handler: _ => handleUpload(_)
        })
      }
    ]
  })
}

setup()
