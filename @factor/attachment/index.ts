import { endpointRequest, authorizedRequest } from "@factor/endpoint"
import { storeItem, extendPostSchema } from "@factor/tools"
import loadImage from "blueimp-load-image"

import { uploadEndpointPath } from "./util"
import storageSchema from "./schema"

extendPostSchema(storageSchema)

export interface PostAttachment {
  url: string;
}

export interface ImageUploadItems {
  file: File | Blob;
  onPrep: Function;
  onFinished: Function;
  onError: Function;
  onChange: Function;
}

export async function sendStorageRequest({
  method,
  params
}: {
  method: string;
  params: object;
}): Promise<object> {
  return await endpointRequest({ id: "storage", method, params })
}

export async function requestDeleteImage(params: object): Promise<object> {
  return await sendStorageRequest({ method: "deleteImage", params })
}

export async function uploadImage({
  file,
  onPrep,
  onFinished,
  onError,
  onChange
}: ImageUploadItems): Promise<void> {
  file = await preUploadImage({ file, onPrep })

  const formData = new FormData()

  formData.append("imageUpload", file)

  const {
    data: { result, error }
  } = await authorizedRequest(uploadEndpointPath(), formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: function(progressEvent) {
      onChange(progressEvent)
    }
  })

  if (error) {
    onError(error)
  } else {
    storeItem(result._id, result)
    onFinished(result)
  }
}

export async function resizeImage(
  fileOrBlobOrUrl: File | Blob,
  { maxWidth = 1500, maxHeight = 1500 }
): Promise<Blob> {
  return await new Promise((resolve) => {
    loadImage(
      fileOrBlobOrUrl,
      (canvas: HTMLCanvasElement) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, fileOrBlobOrUrl.type)
      },
      { maxWidth, maxHeight, canvas: true, orientation: true }
    )
  })
}

export async function preUploadImage(
  { file, onPrep }: { file: File | Blob; onPrep: Function },
  options = {}
): Promise<File | Blob> {
  onPrep({ mode: "started", percent: 5 })

  if (file.type.includes("image")) {
    file = await resizeImage(file, options)

    onPrep({ mode: "resized", percent: 25, preview: URL.createObjectURL(file) })
  }

  onPrep({ mode: "finished", percent: 100 })

  return file
}

// https://stackoverflow.com/a/36183085/1858322
export async function base64ToBlob(
  b64Data: string,
  contentType = "image/jpeg"
): Promise<Blob> {
  const url = `data:${contentType};base64,${b64Data}`
  const response = await fetch(url)
  return await response.blob()
}
