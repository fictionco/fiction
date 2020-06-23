export const figureMixin = ({ ref, width }: { ref: string; width: number }): any => {
  return {
    data(): Record<string, any> {
      return { width }
    },
    computed: {
      scale(this: any): number {
        return Math.max(Math.min(this.width / width, 1), 0.5)
      },
    },
    mounted(this: any): void {
      this.width = this.getWidth()

      window.addEventListener("resize", () => {
        this.width = this.getWidth()
      })
    },
    methods: {
      getWidth(this: any): number {
        return this.$refs[ref] ? this.$refs[ref].clientWidth : 100
      },
    },
  }
}
