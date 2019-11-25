
<template>
  <div class="pattern">
    <canvas ref="area" class="pattern-bubbles" :width="width" :height="height" />
  </div>
</template>
<script>
/* eslint-disable */
const POINTS_CACHE = []
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      height: 2400,
      width: 2400
    }
  },
  computed: {
    imageUrl() {
      return require("./img/modular.svg")
    },
    image() {
      if (!document) {
        return
      }
      const img = document.createElement("img")
      img.setAttribute("src", this.imageUrl)
      return img
    }
  },
  mounted() {
    const c = this.$refs.area
    const ctx = c.getContext("2d")

    const image = new Image()

    image.src = this.imageUrl
    image.addEventListener("load", () => this.drawPattern({ ctx, image }))
  },
  methods: {
    drawPattern({ ctx }) {
      const scale = window.devicePixelRatio
      ctx.lineWidth = 2
      ctx.fillStyle = "transparent"
      ctx.strokeStyle = "#9cdbff"
      // ctx.rect(45, 45, this.width - 5, this.height - 5)

      ctx.arc(600, 800, 500, 0, 2 * Math.PI)
      ctx.fill()
      ctx.clip()

      this.points()
        .map(p => {
          return {
            x: 1200 * p[0],
            y: 1200 * p[1]
          }
        })
        .map(p => {
          return ctx.isPointInPath(p.x * scale, p.y * scale) ? p : false
        })
        .filter(p => p)

      for (let t = 10; t < this.height; t += 25) {
        ctx.beginPath()
        const a = 50 * this.noise(92 * t + 2e-4)
        for (let n = 0; n < this.width; n += 4) {
          ctx.lineTo(n + a, t + 3 * Math.cos(0.15 * n + -5e-4))
        }
        ctx.stroke()
      }

      // ctx.beginPath()
      // for (let t = 0; t < points.length; t++) {
      //   const n = points[t],
      //     a = n.x + 15 * (this.noise(t * t * 123 + 16e-6) - 0.5),
      //     o = n.y + 15 * (this.noise(9820 * t + 2e-4) - 0.5)
      //   ctx.moveTo(a + 5, o), ctx.arc(a, o, 5, 0, 2 * Math.PI)
      // }
      // ctx.stroke()

      // ctx.fillStyle = ctx.createPattern(image, "repeat")
      // ctx.fillRect(0, 0, this.width, this.height)
    },
    noise(e) {
      let perlin
      //PERLIN_ZWRAPB = 8,
      //PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB,
      const PERLIN_SIZE = 4095
      const perlinOctaves = 4
      const perlinAmpFalloff = 0.5
      const scaledCosine = function(e) {
        return 0.5 * (1 - Math.cos(e * Math.PI))
      }

      if (null == perlin) {
        perlin = new Array(PERLIN_SIZE + 1)
        for (let t = 0; t < PERLIN_SIZE + 1; t++) perlin[t] = Math.random()
      }
      e < 0 && (e = -e)
      for (
        var n, a, o = Math.floor(e), r = e - o, i = 0, s = 0.5, c = 0;
        c < perlinOctaves;
        c++
      )
        (n = scaledCosine(r)),
          (a = perlin[o & PERLIN_SIZE]),
          (i += (a += n * (perlin[(o + 1) & PERLIN_SIZE] - a)) * s),
          (s *= perlinAmpFalloff),
          (o <<= 1),
          (r *= 2) >= 1 && (o++, r--)
      return i
    },
    points(e) {
      const t = (e = e || {}).pointRadius || 0.01,
        n = e.ac || {
          x: -2,
          y: -2
        },
        a = e.arBase || 1,
        o = e.bc || {
          x: -2,
          y: 2
        },
        r = e.brBase || 1,
        i = e.dr || 2.5 * t

      function s(e, t, n, a) {
        const o = Math.hypot(n.x - e.x, n.y - e.y)
        let r, i
        if (o <= t + a) {
          const s = (t * t - a * a + o * o) / (2 * o),
            c = Math.sqrt(t * t - s * s)
          if (t < Math.abs(s)) r = i = null
          else {
            const t = (n.x - e.x) / o,
              a = (n.y - e.y) / o
            ;(r = {
              x: e.x + s * t - c * a,
              y: e.y + s * a + c * t
            }),
              (i = {
                x: e.x + s * t + c * a,
                y: e.y + s * a - c * t
              })
          }
        } else r = i = null
        return [r, i]
      }
      if (POINTS_CACHE.length == 0)
        for (let e = 0; e < 128; ++e) {
          const t = a + i * e
          for (let a = 0; a < 128; ++a) {
            s(n, t + (a % 3 ? 0 : 0.3 * i), o, r + i * a + (e % 3 ? 0 : 0.3 * i)).forEach(
              e => {
                e &&
                  e.x < 1 &&
                  e.x > -1 &&
                  e.y < 1 &&
                  e.y > -1 &&
                  POINTS_CACHE.push([e.x, e.y])
              }
            )
          }
        }
      return POINTS_CACHE
    }
  }
})
</script>
<style lang="less">
.pattern {
  //background: red;
  position: relative;
  .pattern-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 2400px;
    height: 2400px;
  }
}
</style>
