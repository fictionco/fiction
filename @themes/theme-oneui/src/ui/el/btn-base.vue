<template lang="pug">
  button.btn(v-if="scope" :class="[buttonClass, `btn-${btn}`]" :type="type" v-on="$listeners" @click.stop="onButtonClick")
    slot
    span(v-if="text" v-text="text")
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component
export default class ThemeButtonBase extends Vue {
  @Prop({ default: "" }) readonly image?: string
  @Prop({ default: "" }) readonly text?: string
  @Prop({ default: "" }) readonly type?: string
  @Prop({ default: false }) readonly loading?: boolean
  @Prop({ default: "" }) readonly circle?: string
  @Prop({ default: "" }) readonly btn?: string
  @Prop({ default: "" }) readonly disabled?: string
  @Prop({ default: "" }) readonly size?: string
  @Prop({ default: "" }) readonly path?: string

  backupCircleClass = "lightcolor"

  get scope(): boolean {
    return this.btn == "test" && !this.$testing.isTest ? false : true
  }
  get buttonClass() {
    const btnClass = []

    if (this.loading) {
      btnClass.push("loading")
    }

    if (this.image) {
      btnClass.push("with-img")
    }

    if (this.disabled) {
      btnClass.push("disabled")
    }

    if (this.btn) {
      btnClass.push(this.btn)
    } else {
      btnClass.push("default")
    }

    if (this.size) {
      switch (this.size) {
        case "small": {
          btnClass.push("btn-sm")
          break
        }
        default: {
          btnClass.push(this.size)
        }
      }
    }

    return btnClass
  }
  get circleClass(): string {
    if (this.circle) {
      return this.circle
    }

    let out = "lightcolor"
    const dark = ["google", "default", "subtle"]

    dark.forEach((_) => {
      if ((this.$el && this.$el.classList.contains(_)) || this.buttonClass.includes(_)) {
        out = "darkcolor"
      }
    })

    return out
  }

  public onButtonClick() {
    if (this.path) {
      this.$router.push(this.path)
    } else {
      this.$emit("click")
    }
  }
}
</script>

<style></style>
