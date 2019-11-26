import { endpointRequest, authorizedRequest } from "@factor/endpoint"
import { pushToFilter, storeItem } from "@factor/tools"
import loadImage from "blueimp-load-image"

import { uploadEndpointPath } from "./util"
import storageSchema from "./schema"

pushToFilter("data-schemas", () => storageSchema)

export async function dataURL(file) {
  const reader = new FileReader()

  return new Promise(resolve => {
    reader.addEventListener("load", function(e) {
      resolve(e.target.result)
    })

    reader.readAsDataURL(file)
  })
}

export async function sendStorageRequest({ method, params }) {
  return await endpointRequest({ id: "storage", method, params })
}

export async function requestDeleteImage(params) {
  return await sendStorageRequest({ method: "deleteImage", params })
}

export async function uploadImage({ file, onPrep, onFinished, onError, onChange }) {
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

export async function resizeImage(fileOrBlobOrUrl, options = {}) {
  const { maxWidth = 1500, maxHeight = 1500 } = options

  return await new Promise(resolve => {
    loadImage(
      fileOrBlobOrUrl,
      canvas => {
        canvas.toBlob(blob => resolve(blob), fileOrBlobOrUrl.type)
      },
      { maxWidth, maxHeight, canvas: true, orientation: true }
    )
  })
}

export async function preUploadImage({ file, onPrep }, options = {}) {
  onPrep({ mode: "started", percent: 5 })

  if (file.type.includes("image")) {
    file = await resizeImage(file, options)

    onPrep({ mode: "resized", percent: 25, preview: URL.createObjectURL(file) })
  }

  onPrep({ mode: "finished", percent: 100 })

  return file
}

// https://stackoverflow.com/a/36183085/1858322
export async function base64ToBlob(b64Data, contentType = "image/jpeg") {
  const url = `data:${contentType};base64,${b64Data}`
  const response = await fetch(url)
  return await response.blob()
}
