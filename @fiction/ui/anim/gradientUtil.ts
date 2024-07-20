/* eslint-disable max-statements-per-line */
// util.ts

export function mix(v1: number, v2: number, a: number): number {
  return v1 * (1 - a) + v2 * a
}

export function rotate(x: number, y: number, angle: number, cx: number, cy: number): number {
  const radians = (Math.PI / 180) * angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return (cos * (x - cx)) + (sin * (y - cy)) + cx
}

export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function animate(
  ctx: CanvasRenderingContext2D,
  resolution: number,
  baseColor: string,
  speed: number,
  blendingMode: string,
  clock: number,
  simplex: SimplexNoise,
): number {
  const imgData = ctx.getImageData(0, 0, resolution, resolution)
  const data = imgData.data

  const baseRgb = hexToRgb(baseColor)
  if (!baseRgb)
    return clock

  const secondColor = {
    r: (baseRgb.r + 50) % 256,
    g: (baseRgb.g + 50) % 256,
    b: (baseRgb.b + 50) % 256,
  }

  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      const noise = simplex.noise3D(x / resolution, y / resolution, clock / speed)
      const index = (x + y * resolution) * 4

      const mixFactor = blendingMode === 'organic'
        ? (rotate(x, y, clock * 0.5, resolution / 2, resolution / 2) / resolution * 3.5) * noise / 2
        : rotate(x, y, clock * 0.5, resolution / 2, resolution / 2) / resolution * 2

      data[index] = mix(baseRgb.r, secondColor.r, mixFactor)
      data[index + 1] = mix(baseRgb.g, secondColor.g, mixFactor)
      data[index + 2] = mix(baseRgb.b, secondColor.b, mixFactor)
      data[index + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return clock + 1
}

export class SimplexNoise {
  private p: Uint8Array
  private perm: Uint8Array
  private permMod12: Uint8Array
  private grad3: Float32Array

  constructor(randomOrSeed?: (() => number) | string) {
    const random: () => number = typeof randomOrSeed === 'function'
      ? randomOrSeed
      : randomOrSeed
        ? this.alea(randomOrSeed)
        : Math.random

    this.p = this.buildPermutationTable(random)
    this.perm = new Uint8Array(512)
    this.permMod12 = new Uint8Array(512)
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255]
      this.permMod12[i] = this.perm[i] % 12
    }

    this.grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1])
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const { permMod12, perm, grad3 } = this
    const F3 = 1 / 3
    const G3 = 1 / 6

    let n0: number, n1: number, n2: number, n3: number
    const s: number = (xin + yin + zin) * F3
    const i: number = Math.floor(xin + s)
    const j: number = Math.floor(yin + s)
    const k: number = Math.floor(zin + s)
    const t: number = (i + j + k) * G3
    const X0: number = i - t
    const Y0: number = j - t
    const Z0: number = k - t
    const x0: number = xin - X0
    const y0: number = yin - Y0
    const z0: number = zin - Z0

    let i1: number, j1: number, k1: number
    let i2: number, j2: number, k2: number
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 }
    }
    else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
    }

    const x1: number = x0 - i1 + G3
    const y1: number = y0 - j1 + G3
    const z1: number = z0 - k1 + G3
    const x2: number = x0 - i2 + 2 * G3
    const y2: number = y0 - j2 + 2 * G3
    const z2: number = z0 - k2 + 2 * G3
    const x3: number = x0 - 1 + 3 * G3
    const y3: number = y0 - 1 + 3 * G3
    const z3: number = z0 - 1 + 3 * G3

    const ii: number = i & 255
    const jj: number = j & 255
    const kk: number = k & 255

    let t0: number = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    if (t0 < 0) {
      n0 = 0
    }
    else {
      const gi0: number = permMod12[ii + perm[jj + perm[kk]]] * 3
      t0 *= t0
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0)
    }

    let t1: number = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    if (t1 < 0) {
      n1 = 0
    }
    else {
      const gi1: number = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3
      t1 *= t1
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1)
    }

    let t2: number = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    if (t2 < 0) {
      n2 = 0
    }
    else {
      const gi2: number = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3
      t2 *= t2
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2)
    }

    let t3: number = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    if (t3 < 0) {
      n3 = 0
    }
    else {
      const gi3: number = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3
      t3 *= t3
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3)
    }

    return 32 * (n0 + n1 + n2 + n3)
  }

  private buildPermutationTable(random: () => number): Uint8Array {
    const p: Uint8Array = new Uint8Array(256)
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }
    for (let i = 0; i < 255; i++) {
      const r: number = i + ~~(random() * (256 - i))
      const aux: number = p[i]
      p[i] = p[r]
      p[r] = aux
    }
    return p
  }

  private alea(...args: string[]): () => number {
    const masher = (): (data: string) => number => {
      let n = 0xEFC8249D
      return (data: string): number => {
        for (let i = 0; i < data.length; i++) {
          n += data.charCodeAt(i)
          let h = 0.02519603282416938 * n
          n = h >>> 0
          h -= n
          h *= n
          n = h >>> 0
          h -= n
          n += h * 0x100000000
        }
        return (n >>> 0) * 2.3283064365386963e-10
      }
    }

    let s0 = 0
    let s1 = 0
    let s2 = 0
    let c = 1

    const mash = masher()
    s0 = mash(' ')
    s1 = mash(' ')
    s2 = mash(' ')

    for (const arg of args) {
      s0 -= mash(arg)
      if (s0 < 0)
        s0 += 1
      s1 -= mash(arg)
      if (s1 < 0)
        s1 += 1
      s2 -= mash(arg)
      if (s2 < 0)
        s2 += 1
    }

    return (): number => {
      const t = 2091639 * s0 + c * 2.3283064365386963e-10
      s0 = s1
      s1 = s2
      return s2 = t - (c = t | 0)
    }
  }
}
