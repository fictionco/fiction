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
        r: Number.parseInt(result[1] ?? '0', 16),
        g: Number.parseInt(result[2] ?? '0', 16),
        b: Number.parseInt(result[3] ?? '0', 16),
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
      const o = this.p[i & 255] ?? 0
      this.perm[i] = 0
      this.permMod12[i] = o % 12
    }

    this.grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1])
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const { permMod12, perm, grad3 } = this
    const F3 = 1 / 3
    const G3 = 1 / 6

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
      if (y0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0]
      }
      else if (x0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1]
      }
      else {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1]
      }
    }
    else {
      if (y0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1]
      }
      else if (x0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1]
      }
      else {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0]
      }
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

    const calculateNoise = (t: number, gi: number, x: number, y: number, z: number): number => {
      if (t < 0)
        return 0
      t *= t
      return t * t * ((grad3[gi] ?? 0) * x + (grad3[gi + 1] ?? 0) * y + (grad3[gi + 2] ?? 0) * z)
    }

    const getGi = (i: number, j: number, k: number): number => {
      const index = ii + i + (perm[jj + j + (perm[kk + k] ?? 0)] ?? 0)
      return (permMod12[index] ?? 0) * 3
    }

    const t0: number = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    const gi0: number = getGi(0, 0, 0)
    const n0 = calculateNoise(t0, gi0, x0, y0, z0)

    const t1: number = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    const gi1: number = getGi(i1, j1, k1)
    const n1 = calculateNoise(t1, gi1, x1, y1, z1)

    const t2: number = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    const gi2: number = getGi(i2, j2, k2)
    const n2 = calculateNoise(t2, gi2, x2, y2, z2)

    const t3: number = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    const gi3: number = getGi(1, 1, 1)
    const n3 = calculateNoise(t3, gi3, x3, y3, z3)

    return 32 * (n0 + n1 + n2 + n3)
  }

  private buildPermutationTable(random: () => number): Uint8Array {
    const p: Uint8Array = new Uint8Array(256)
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }
    for (let i = 0; i < 255; i++) {
      const r: number = i + ~~(random() * (256 - i))
      const aux: number = p[i] ?? 0
      p[i] = p[r] ?? 0
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
