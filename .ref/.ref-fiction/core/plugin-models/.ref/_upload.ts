import { FactorObject } from '@factor/api'
import smartcrop from '../image-upload/lib/smartcrop'
import loadImage from '../image-upload/lib/loadImage'
import stripes from './lib/stripes-light.png'

const defaultConfig = {
  targetWidth: 512,
  targetHeight: 512,
  focalX: 0.5,
  focalY: 0.5,
  autoFocal: true,
  imageFormat: 'preserve',
  qualityJpeg: 80,
  qualityWebp: 70,
}

interface BFileSettings {
  file: File
  n: number
  url?: string
  config?: { imageFormat: 'jpeg' | 'png' | 'webp' }
}

class BFile extends FactorObject<BFileSettings> {
  fileId = this.utils.objectId()
  file = this.settings.file
  n = this.settings.n
  size = this.file.size
  dotIndex = this.file.name.lastIndexOf('.')
  baseName = this.file.name.slice(0, this.dotIndex)
  extension = this.file.name.slice(this.dotIndex + 1)
  fx = 0.5
  fy = 0.5
  isCustomFocal = false
  url = this.settings.url
  config = defaultConfig
  image?: HTMLImageElement
  width?: number
  height?: number
  constructor(args: BFileSettings) {
    super('BFile', args)
    this.read().catch(error => this.log.error('read error', { error }))
  }

  get outputFormat():
    | {
      ext: 'jpg' | 'webp' | 'png' | string
      format: 'image/jpeg' | 'image/webp' | 'image/png'
    }
    | undefined {
    if (this.config.imageFormat === 'jpeg')
      return { ext: 'jpg', format: 'image/jpeg' }

    if (this.config.imageFormat === 'webp')
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
          this.image = image
          this.width = image.width
          this.height = image.height
          this.url = image.src

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

  get path() {
    return this.url || this.file
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

  get focalX() {
    if (this.isCustomFocal || this.config.autoFocal)
      return this.fx
    else
      return this.config.focalX
  }

  get focalY() {
    if (this.isCustomFocal || this.config.autoFocal)
      return this.fy
    else
      return this.config.focalY
  }
}

interface BirmeSettings {}

class Birme extends FactorObject<BirmeSettings> {
  files: BFile[] = []
  filesToAdd: BFile[] = []
  filesToSave: BFile[] = []
  outputZip = false
  fileCounter = 0
  maskPattern = new Image()
  selectedHolder?: HTMLElement
  tilesHolder = document.querySelector('.tiles-holder')
  dropArea = document.querySelector('.drop-area')

  constructor() {
    super('Birme', {})

    this.maskPattern.src = stripes
    // this.masonry = new Masonry(".tiles-holder", {
    //   transitionDuration: 0,
    // })

    if (this.dropArea) {
      this.dropArea.addEventListener('drop', async (e) => {
        e.stopPropagation()
        e.preventDefault()
        await this.addAll(e as DragEvent)
      })
      this.dropArea.addEventListener('dragover', (e) => {
        e.stopPropagation()
        e.preventDefault()
      })
      this.dropArea.addEventListener('dragenter', (e) => {
        e.stopPropagation()
        e.preventDefault()
      })
    }

    this.tilesHolder?.addEventListener('scroll', _ =>
      this.previewVisible(false))
    window.addEventListener('resize', _ => this.previewVisible(true))
    //  window.addEventListener("mouseup", (_) => $(document).off("mousemove"))
  }

  async addAll(e: DragEvent) {
    this.filesToAdd = []
    const target = e.target as HTMLInputElement
    const _files = e.dataTransfer ? e.dataTransfer.files : target?.files

    if (!_files)
      return

    for (const _file of _files) {
      const f = new BFile({ file: _file, n: this.files.length })
      if (f.isSupported) {
        this.files.push(f)
        this.filesToAdd.push(f)
      }
    }

    await this.addOne()
  }

  async addOne() {
    const f = this.filesToAdd.shift()
    if (!f) {
      setTimeout(() => {
        this.previewVisible(false)
      }, 500)
      return
    }
    const ele = `<div class="tile">
        <div class="image-holder">
              <div class="btn-delete">x</div>
              <canvas class="image-mask"/>
          </div>
          <p>${f.truncatedFilename}</p>
      </div>`
    this.tilesHolder?.append(ele)
    const lastTileEl = document.querySelector('.tile:last-child')
    //  this.masonry.appended(lastTileEl)
    const holder = lastTileEl?.querySelector('.image-holder') as HTMLElement

    if (!holder)
      return

    await f.read(async (img) => {
      holder.append(img)
      await this.addOne()
    })
    holder.dataset.file = f.fileId
    holder?.addEventListener('mousedown', e => this.handleMouseDown(e))
    // this.masonry.layout()
  }

  previewVisible(forceUpdate = false) {
    //  this.masonry.layout()
    const tiles = document.querySelectorAll('.tile')
    const holder = document.querySelector('.tiles-holder') as HTMLElement
    for (const [i, tile] of tiles.entries()) {
      const tileEl = tile as HTMLElement
      if (
        tileEl.offsetTop + tileEl.offsetHeight - holder.scrollTop > 0
        && tileEl.offsetTop - holder.scrollTop < holder.offsetHeight
      )
        this.previewOne(tileEl, this.files[i], forceUpdate)
    }
  }

  previewOne(holder: HTMLElement, file: BFile, forceUpdate: boolean) {
    const mask = holder.querySelector('.image-mask') as HTMLCanvasElement
    if (
      !forceUpdate
      && mask
      && Number.parseFloat(mask.getAttribute('width') ?? '0') > 0
    )
      return

    const img = holder.querySelector('img') as HTMLImageElement
    const tw = defaultConfig.targetWidth
    const th = defaultConfig.targetHeight
    const fx = this.focalX
    const fy = this.focalY
    const w = img.offsetWidth
    const h = img.offsetHeight
    const nw = tw * Math.min(w / tw, h / th)
    const nh = th * Math.min(w / tw, h / th)

    mask.setAttribute('width', String(w))
    mask.setAttribute('height', String(h))

    const ctx = mask.getContext('2d')

    if (!ctx)
      return

    ctx.fillStyle = ctx.createPattern(
      this.maskPattern,
      'repeat',
    ) as CanvasPattern

    ctx.fillRect(0, 0, w, h)
    ctx.clearRect((w - nw) * fx, (h - nh) * fy, nw, nh)
  }

  async saveAll() {
    this.filesToSave = [...this.files]
    await this.saveOne()
  }

  async saveOne() {
    if (this.filesToSave.length === 0)
      return

    const f = this.filesToSave.shift()

    if (!f?.path)
      return

    await loadImage(
      f.path,
      (img: HTMLImageElement) => this.processImage(img, f),
      {
        orientation: 1,
      },
    )
  }

  // stepdown(img, tw, th) {
  //   let iw = img.width
  //   let ih = img.height
  //   while (iw > tw * 1.8 && ih > th * 1.8) {
  //     const canvas = document.createElement("canvas")
  //     iw = Math.floor(iw / 1.8)
  //     ih = Math.floor(ih / 1.8)
  //     canvas.width = iw
  //     canvas.height = ih
  //     const con = canvas.getContext("2d")
  //     if (!con) continue
  //     con.imageSmoothingEnabled = true
  //     con.imageSmoothingQuality = "medium"
  //     con.drawImage(img, 0, 0, iw, ih)
  //     img = canvas
  //   }
  //   return img
  // }

  processImage(img: HTMLImageElement, file: BFile) {
    const tw = defaultConfig.targetWidth
    const th = defaultConfig.targetHeight

    const fx = file.focalX
    const fy = file.focalY

    const iw = img.width
    const ih = img.height

    // img = this.stepdown(img, tw, th);

    const canvas = document.createElement('canvas')
    canvas.width = tw
    canvas.height = th
    const con = canvas.getContext('2d')
    if (!con)
      return
    con.imageSmoothingEnabled = true
    con.imageSmoothingQuality = 'medium'
    const scale = Math.min(iw / tw, ih / th)
    const srcw = tw * scale
    const srch = th * scale

    const output = file.outputFormat
    // Draw a white background for transparent images
    if (output?.format === 'image/jpeg' && !file.isJpeg) {
      con.fillStyle = 'white'
      con.fillRect(0, 0, tw, th)
    }

    const hw = 0

    con.drawImage(
      img,
      (iw - srcw) * fx,
      (ih - srch) * fy,
      srcw,
      srch,
      hw,
      hw,
      tw - hw * 2,
      th - hw * 2,
    )

    const newFilename = `${file.baseName}.${output?.ext}`
    let quality = 1
    if (output?.format === 'image/jpeg')
      quality = defaultConfig.qualityJpeg / 100
    else if (output?.format === 'image/webp')
      quality = defaultConfig.qualityWebp / 100

    canvas.toBlob(
      async (b) => {
        //  saveAs(b, newFilename)
        await this.saveOne()
      },
      output?.format,
      quality,
    )
  }

  handleMouseDown(args: { el: HTMLElement, event: MouseEvent, file: BFile }) {
    const { el, event, file } = args
    el.dataset.x = String(event.clientX)
    el.dataset.y = String(event.clientY)
    el.dataset.fx = String(file.focalX)
    el.dataset.fy = String(file.focalY)

    this.selectedHolder = el
    // $(document).off("mousemove")
    // $(document).on("mousemove", birme.imageMouseMove)
  }

  static imageMouseMove(event: MouseEvent) {
    const holder = birme.selectedHolder
    const file = holder.data('file')

    const x = event.clientX
    const y = event.clientY
    const ox = holder.data('x')
    const oy = holder.data('y')

    const fx = holder.data('fx')
    const fy = holder.data('fy')

    let new_fx = fx + ((x - ox) / holder.width()) * 2
    let new_fy = fy + ((y - oy) / holder.height()) * 2

    new_fx = Math.max(0, Math.min(1, new_fx))
    new_fy = Math.max(0, Math.min(1, new_fy))

    file.fx = new_fx
    file.fy = new_fy
    file.is_custom_focal = true

    if (new_fx !== fx || new_fy !== fy)
      birme.previewOne(holder.get(0), file, true)
  }

  // _get_holder_index(holder) {
  //   const holders = $(".image-holder")
  //   for (const [i, holder_] of holders.entries()) {
  //     if (holder_ === holder) {
  //       return i
  //     }
  //   }
  //   return -1
  // }

  // _add_test_image(n, ext) {
  //   const f = new BFile(
  //     new File([""], `test-image-${n}.${ext}`),
  //     this.files.length,
  //     `http://${document.location.host}/static/images/test/${n}.${ext}`,
  //   )
  //   this.files.push(f)
  //   this.filesToAdd.push(f)
  //   this.addOne()
  // }
}

const birme = new Birme()
