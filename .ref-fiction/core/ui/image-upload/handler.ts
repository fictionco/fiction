import { FactorObject } from '@factor/api'
import JSZip from 'jszip'
import smartcrop from './lib/smartcrop'
import stripes from './lib/stripes-light.png'

const defaultConfig = {
  targetWidth: 512,
  targetHeight: 512,
  imageFormat: 'jpeg',
  qualityJpeg: 100,
  qualityWebp: 100,
}

interface BFileSettings {
  file: File
  url?: string
  renderedData?: Blob
}

export class ImageFile extends FactorObject<BFileSettings> {
  mediaId = this.utils.objectId()
  file = this.settings.file
  renderedData = this.settings.renderedData
  renderedUrl?: string
  size = this.file.size
  dotIndex = this.file.name.lastIndexOf('.')
  baseName = this.file.name.slice(0, this.dotIndex)
  extension = this.file.name.slice(this.dotIndex + 1)
  fx = 0.5
  fy = 0.5
  isCustomFocal = false
  url = this.settings.url
  image?: HTMLImageElement
  width?: number
  height?: number
  displayWidth: number = -1
  displayHeight: number = -1
  maskPattern = new Image()
  mouseDownX = 0
  mouseDownY = 0
  mouseDownFocalX = 0
  mouseDownFocalY = 0
  mouseActive = false
  lastX = -1
  lastY = -1
  aspectMode: 'landscape' | 'portrait' | 'square' = 'square'
  uploadProgress = this.utils.vue.ref(0)
  constructor(args: BFileSettings) {
    super('BFile', args)
    this.maskPattern.src = stripes
  }

  get outputFormat(): {
    ext: 'jpg' | 'webp' | 'png' | string
    format: 'image/jpeg' | 'image/webp' | 'image/png'
  } {
    if (defaultConfig.imageFormat === 'jpeg')
      return { ext: 'jpg', format: 'image/jpeg' }

    if (defaultConfig.imageFormat === 'webp')
      return { ext: 'webp', format: 'image/webp' }

    // Preserve format
    switch (this.extension.toLowerCase()) {
      case 'png': {
        return { ext: 'png', format: 'image/png' }
      }
      case 'jpg':
      case 'jpeg': {
        return { ext: this.extension, format: 'image/jpeg' }
      }
      case 'webp': {
        return { ext: 'webp', format: 'image/webp' }
      }
      default: {
        return { ext: 'jpg', format: 'image/jpeg' }
      }
    }
  }

  async init() {
    await new Promise(async (resolve) => {
      const reader = new FileReader()

      reader.readAsDataURL(this.file)
      reader.addEventListener('load', () => {
        const image = new Image()
        image.src = reader.result as string

        image.addEventListener('load', async () => {
          const { width, height } = image

          if (width < 512 || height < 512) {
            const canvas = document.createElement('canvas')
            let scale = 1
            if (width > height)
              scale = 512 / width
            else
              scale = 512 / height

            canvas.width = width * scale
            canvas.height = height * scale
            const ctx = canvas.getContext('2d')
            if (!ctx)
              return
            ctx.drawImage(image, 0, 0, width * scale, height * scale)

            // Set the src property of the Image object to the data URL of the canvas
            image.src = canvas.toDataURL()
          }

          this.image = image
          this.width = image.width
          this.height = image.height
          this.url = image.src

          this.aspectMode = this.width > this.height ? 'landscape' : 'portrait'

          if (!this.width || !this.height || !this.image)
            return

          const result = (await smartcrop.crop(this.image, {
            width: Math.min(this.width, this.height),
            height: Math.min(this.width, this.height),
          })) as { topCrop: { x: number, y: number } }

          this.fx = result.topCrop.x / this.width
          this.fy = result.topCrop.y / this.height

          resolve(image)
        })
      })
    })
  }

  addMask() {
    const maskEl = document.querySelector(
      `.mask-${this.mediaId}`,
    ) as HTMLCanvasElement
    const imageEl = document.querySelector(
      `.image-${this.mediaId}`,
    ) as HTMLCanvasElement

    if (!imageEl || !maskEl)
      return

    const tw = defaultConfig.targetWidth
    const th = defaultConfig.targetHeight
    const fx = this.fx
    const fy = this.fy
    const rectWidth = imageEl.offsetWidth
    const rectHeight = imageEl.offsetHeight
    const portWidth = tw * Math.min(rectWidth / tw, rectHeight / th)
    const portHeight = th * Math.min(rectWidth / tw, rectHeight / th)

    maskEl.setAttribute('width', String(rectWidth))
    maskEl.setAttribute('height', String(rectHeight))

    const ctx = maskEl.getContext('2d')

    if (!ctx)
      return

    ctx.fillStyle = ctx.createPattern(
      this.maskPattern,
      'repeat',
    ) as CanvasPattern

    //  this.log.info("mask", { data: { rectHeight, portHeight, fy } })
    ctx.fillRect(0, 0, rectWidth, rectHeight)
    ctx.clearRect(
      (rectWidth - portWidth) * fx,
      (rectHeight - portHeight) * fy,
      portWidth,
      portHeight,
    )
  }

  handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement
    this.displayHeight = target.offsetHeight
    this.displayWidth = target.offsetWidth
    this.mouseDownX = event.clientX
    this.mouseDownY = event.clientY
    this.mouseDownFocalX = this.fx
    this.mouseDownFocalY = this.fy

    this.mouseActive = true

    window.addEventListener('mouseup', () => (this.mouseActive = false))
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.mouseActive)
      return
    if (!this.width || !this.height)
      return

    const x = event.clientX
    const y = event.clientY

    const ox = this.mouseDownX
    const oy = this.mouseDownY

    const ofx = this.mouseDownFocalX
    const ofy = this.mouseDownFocalY

    let newFx = ofx + ((x - ox) / this.displayWidth) * 2
    let newFy = ofy + ((y - oy) / this.displayHeight) * 2

    newFx = Math.max(0, Math.min(1, newFx))
    newFy = Math.max(0, Math.min(1, newFy))

    if (newFx !== ofx || newFy !== ofy) {
      this.fx = newFx
      this.fy = newFy

      this.addMask()
    }
  }

  async renderImageData(): Promise<Blob | undefined> {
    const targetWidth = defaultConfig.targetWidth
    const targetHeight = defaultConfig.targetHeight

    const fx = this.fx
    const fy = this.fy

    const imageWidth = this.width
    const imageHeight = this.height

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const con = canvas.getContext('2d')

    if (!con)
      throw new Error('no canvas context')
    if (!imageWidth || !imageHeight || !this.image)
      throw new Error('no image')

    con.imageSmoothingEnabled = true
    con.imageSmoothingQuality = 'medium'

    const scale = Math.min(imageWidth / targetWidth, imageHeight / targetHeight)
    const srcw = targetWidth * scale
    const srch = targetHeight * scale

    const output = this.outputFormat
    // Draw a white background for transparent images
    if (output.format === 'image/jpeg' && !this.isJpeg) {
      con.fillStyle = 'white'
      con.fillRect(0, 0, targetWidth, targetHeight)
    }

    // use hw if setting a border

    const hw = 0
    con.drawImage(
      this.image,
      (imageWidth - srcw) * fx,
      (imageHeight - srch) * fy,
      srcw,
      srch,
      hw,
      hw,
      targetWidth - hw * 2,
      targetHeight - hw * 2,
    )

    // const newFilename = `${this.mediaId}.${output.ext}`

    let quality = 1
    if (output.format === 'image/jpeg')
      quality = defaultConfig.qualityJpeg / 100
    else if (output.format === 'image/webp')
      quality = defaultConfig.qualityWebp / 100

    const renderedData = await new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob || undefined)
        },
        output.format,
        quality,
      )
    })

    this.renderedData = renderedData

    this.renderedUrl = URL.createObjectURL(renderedData as Blob)

    return this.renderedData
  }

  // get path() {
  //   return this.url || this.file
  // }

  get outputFilename() {
    return `${this.mediaId}.${this.outputFormat.ext}`
  }

  get isJpeg() {
    return ['jpg', 'jpeg'].includes(this.extension.toLowerCase())
  }

  get truncatedFilename() {
    let filename = this.baseName
    if (this.baseName.length > 20)
      filename = `${this.baseName.slice(0, 15)}..${this.baseName.slice(-5)}`

    return `${filename}.${this.extension}`
  }

  get isSupported() {
    return ['jpg', 'jpeg', 'png', 'webp'].includes(this.extension.toLowerCase())
  }
}

interface MultiImageHandlerSettings {
  fileRecord?: Record<string, File>
}
export class MultiImageHandler extends FactorObject<MultiImageHandlerSettings> {
  files = this.utils.vue.shallowRef<ImageFile[]>([])
  zipFile: Blob | undefined
  fileRecord: Record<string, File> = {}
  loadingImages = this.utils.vue.ref(false)
  constructor(settings: MultiImageHandlerSettings = {}) {
    super('ImageUploadHandler', settings)
    const f = Object.values(settings.fileRecord ?? {})
    this.addFiles(f).catch(console.error)
    this.handleResize()
  }

  handleResize() {
    if (typeof window === 'undefined')
      return
    // readd masks on resize
    let resizeTimeout: NodeJS.Timeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.addMasks()
      }, 250)
    })
  }

  addMasks() {
    this.files.value.forEach((f) => {
      f.addMask()
    })
  }

  async addFile(file: File) {
    const imageFile = new ImageFile({ file })

    await imageFile.init()

    this.files.value = [...this.files.value, imageFile]

    this.fileRecord[imageFile.mediaId] = file
  }

  async addFiles(files?: FileList | File[]) {
    if (!files)
      return

    const promises = []
    for (const file of files)
      promises.push(this.addFile(file))

    await Promise.all(promises)

    this.addMasks()
  }

  async addFilesFromZipUrl(url: string) {
    this.loadingImages.value = true
    // get zip file from url
    const response = await fetch(url)
    const blob = await response.blob()

    const zip = await JSZip.loadAsync(blob)

    const promises = []
    for (const filename of Object.keys(zip.files)) {
      const blobItem = await zip.file(filename)?.async('blob')

      if (blobItem) {
        const file = new File([blobItem], filename)
        promises.push(this.addFile(file))
      }
    }

    await Promise.all(promises)

    this.loadingImages.value = false
  }

  async removeFiles(files: ImageFile[]) {
    const ids = new Set(files.map(f => f.mediaId))
    // remove files based on mediaId
    this.files.value = this.files.value.filter(f => !ids.has(f.mediaId))

    // remove file associated with mediaId
    for (const id of ids)
      delete this.fileRecord[id]

    // give time for files to be fully removed
    await this.utils.waitFor(100)

    this.addMasks()
  }

  async renderImages() {
    const promises = []
    for (const file of this.files.value)
      promises.push(file.renderImageData())

    await Promise.all(promises)

    this.log.info('rendered images', {
      data: this.files.value.map(f => f.renderedUrl),
    })

    // create a zip file of all image files
    const zip = new JSZip()
    for (const file of this.files.value) {
      if (file.renderedData)
        zip.file(file.outputFilename, file.renderedData)
    }

    this.zipFile = await zip.generateAsync({ type: 'blob' })

    return this.zipFile
  }
}
