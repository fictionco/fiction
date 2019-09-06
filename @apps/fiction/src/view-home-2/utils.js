export default () => {
  return new (class {
    constructor() {}

    figureMixin({ ref, width }) {
      return {
        data() {
          return {
            width
          }
        },
        computed: {
          scale() {
            return Math.max(Math.min(this.width / width, 1), 0.5)
          }
        },
        mounted() {
          this.width = this.getWidth()

          window.addEventListener("resize", () => {
            this.width = this.getWidth()
          })
        },
        methods: {
          getWidth() {
            return this.$refs[ref] ? this.$refs[ref].clientWidth : 100
          }
        }
      }
    }
  })()
}
