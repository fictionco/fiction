import { endpointRequest, authorizedRequest, EndpointParameters } from "@factor/endpoint"
import { storeItem, addPostSchema } from "@factor/api"
import loadImage from "blueimp-load-image"
import { uploadEndpointPath } from "./util"
import storageSchema from "./schema"
import { PreUploadProperties } from "./types"
addPostSchema(storageSchema)

export interface PostAttachment {
  url: string;
}

export interface ImageUploadItems {
  file: File | Blob;
  onPrep?: Function;
  onFinished?: Function;
  onError?: Function;
  onChange?: Function;
}

export const sendStorageRequest = async ({
  method,
  params
}: {
  method: string;
  params: EndpointParameters;
}): Promise<object> => {
  return (await endpointRequest({ id: "storage", method, params })) as object
}

/**
 * Sends a request to endpoint to delete an image
 */
export const requestDeleteImage = async (params: EndpointParameters): Promise<object> => {
  return await sendStorageRequest({ method: "deleteImage", params })
}

/**
 * Resize a raw file upload and return as blog
 * Makes for better storage and uploading
 * @param fileOrBlobOrUrl - Image file or blob
 * @param {maxHeight, maxWidth} - Max dimensions of returned image
 */
export const resizeImage = async (
  fileOrBlobOrUrl: File | Blob,
  { maxWidth = 1200, maxHeight = 1200 }
): Promise<Blob> => {
  return await new Promise(resolve => {
    loadImage(
      fileOrBlobOrUrl,
      (canvas: HTMLCanvasElement) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob)
        }, fileOrBlobOrUrl.type)
      },
      { maxWidth, maxHeight, canvas: true, orientation: true }
    )
  })
}

/**
 * Optimize the image for upload
 * @param file - the image to upload
 * @param options  - image resizing options
 */
export const preUploadImage = async (
  { file, onPrep }: { file: File | Blob; onPrep?: Function },
  options = {}
): Promise<File | Blob> => {
  if (onPrep) {
    onPrep({ mode: "started", percent: 5 } as PreUploadProperties)
  }

  if (file.type.includes("image")) {
    file = await resizeImage(file, options)

    if (onPrep) {
      onPrep({
        mode: "resized",
        percent: 25,
        preview: URL.createObjectURL(file)
      } as PreUploadProperties)
    }
  }

  if (onPrep) {
    onPrep({ mode: "finished", percent: 100 } as PreUploadProperties)
  }

  return file
}

/**
 * Upload an image
 * @param file - the image
 * @param onPrep - callback during prep process
 * @param onFinished - callback when finished uploading
 * @param onError - callback if an error occurs
 * @param onChange - callback with upload progress info
 */
export const uploadImage = async ({
  file,
  onPrep,
  onFinished,
  onError,
  onChange
}: ImageUploadItems): Promise<void> => {
  file = await preUploadImage({ file, onPrep })

  const formData = new FormData()

  formData.append("imageUpload", file)

  const {
    data: { result, error }
  } = await authorizedRequest(uploadEndpointPath(), formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: function(progressEvent) {
      if (onChange) {
        onChange(progressEvent)
      }
    }
  })

  if (error && onError) {
    onError(error)
  } else {
    storeItem(result._id, result)
    if (onFinished) {
      onFinished(result)
    }
  }
}
