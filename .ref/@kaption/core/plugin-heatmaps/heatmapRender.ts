const defaultRadius = 25
const defaultBlur = 15
const defaultMax = 1
const gradientStops: Record<number, string> = {
  0.4: '#5233FF',
  0.6: '#FAF0CA',
  0.7: '#F4D35E',
  0.8: '#EE964B',
  1: '#F95738',
}
const minPointOpacity = 0.05

type HeatmapDataPoint = [number, number, number]

function colorize(imageData: ImageData, gradient: Uint8ClampedArray): ImageData {
  const pixels = imageData.data
  for (let i = 0, len = pixels.length, j; i < len; i += 4) {
    j = pixels[i + 3] * 4 // get gradient color from opacity value

    if (j) {
      imageData.data[i] = gradient[j]
      imageData.data[i + 1] = gradient[j + 1]
      imageData.data[i + 2] = gradient[j + 2]
    }
  }

  return imageData
}

function heatRadius(r = defaultRadius, blur = defaultBlur): { circle: HTMLCanvasElement, fullRadius: number } {
  const circle = document.createElement('canvas')
  const ctx = circle.getContext('2d')
  const fullRadius = r + blur

  circle.width = circle.height = fullRadius * 2

  if (!ctx)
    throw new Error('no 2d context')

  ctx.shadowOffsetX = ctx.shadowOffsetY = fullRadius * 2
  ctx.shadowBlur = blur
  ctx.shadowColor = 'black'

  ctx.beginPath()
  ctx.arc(-fullRadius, -fullRadius, r, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()

  return { circle, fullRadius }
}

function heatGradient(): Uint8ClampedArray {
  // create a 256x1 gradient that we'll use to turn a gray scale heatmap into a colored one
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx)
    throw new Error('no 2d context')

  const gradient = ctx.createLinearGradient(0, 0, 0, 256)

  canvas.width = 1
  canvas.height = 256

  for (const i in gradientStops)
    gradient.addColorStop(+i, gradientStops[i])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)

  const gradientArray = ctx.getImageData(0, 0, 1, 256).data

  return gradientArray
}

export function drawHeatmap(heatmapCanvas: HTMLCanvasElement, data: HeatmapDataPoint[]): HTMLCanvasElement {
  const { circle, fullRadius } = heatRadius()
  const grad = heatGradient()
  const ctx = heatmapCanvas.getContext('2d')

  if (!ctx)
    throw new Error('no 2d context')

  ctx.clearRect(0, 0, heatmapCanvas.width, heatmapCanvas.height)

  // draw a gray scale heatmap by putting a blurred circle at each data point
  for (let i = 0, len = data.length, p: HeatmapDataPoint; i < len; i++) {
    p = data[i]
    ctx.globalAlpha = Math.min(Math.max(p[2] / defaultMax, minPointOpacity), 1)

    ctx.drawImage(circle, p[0] - fullRadius, p[1] - fullRadius)
  }

  // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
  const colored = ctx.getImageData(
    0,
    0,
    heatmapCanvas.width,
    heatmapCanvas.height,
  )

  ctx.putImageData(colorize(colored, grad), 0, 0)

  return heatmapCanvas
}
