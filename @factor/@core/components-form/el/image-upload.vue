<template>
  <div class="image-upload-container">
    <div class="image-upload-input">
      <factor-loading-ring v-if="loading" width="2em" />
      <div v-show="!loading" ref="organizer" class="image-organizer">
        <div
          v-for="(img, index) in images"
          :key="img.url"
          :class="max <= 1 ? 'no-sort-img' : 'sort-img'"
          :test="img.guid"
          class="image-item image-uploaded"
          @click="lightboxShow = true; lightboxIndex = index"
        >
          <div class="image-item-pad">
            <div
              :style="styleImageBG(img)"
              :class="img.status || 'no-status'"
              class="image-item-content"
            >
              <div class="status-bar">
                <transition name="downfade">
                  <div
                    v-if="img.status === 'progress' || img.status === 'preprocess'"
                    class="status overlay"
                    :class="img.status"
                  >
                    <div :style="{width: `${img.progress}%`}" class="bar" />
                  </div>
                  <div v-else-if="img.status === 'complete'" class="status overlay success">
                    <i class="fa fa-check" />
                  </div>
                  <div v-else-if="img.status === 'error'" class="status overlay failure">
                    <i class="fa fa-remove" />
                  </div>
                  <div
                    v-else
                    class="status overlay trash"
                    @click.stop="removeImage(img.path, index)"
                  >
                    <i class="fa fa-remove" />
                  </div>
                </transition>
                <div class="status overlay copy-url" @click.stop="copyUrl(img.url)">
                  <i class="fa fa-copy" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="max == 1 || images.length < max"
          ref="multiImageDrop"
          class="image-item ignore-sortable image-drop"
        >
          <div class="image-item-pad">
            <div class="image-item-content">
              <input
                ref="multiImageInput"
                class="input-upload"
                type="file"
                accept="image/*"
                multiple
                @change="handleMultiUpload($event)"
              >
              <div class="upload-status">
                <div class="wrp">
                  <i class="fa fa-arrow-up" />
                  <span v-if="images.length == 1 && max == 1">Swap</span>
                  <span v-else>Add</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input ref="copyInput" v-model="copyText" type="text" class="invisible-copy">
    <factor-lightbox :visible.sync="lightboxShow" :imgs="images" :index="lightboxIndex" />
  </div>
</template>
<script>
import Sortable from "sortablejs"
export default {
  props: {
    value: { type: Array, default: () => [] },
    customValidity: { type: String, default: "" },
    watermark: { type: Boolean, default: false }
  },
  data() {
    return {
      images: [],
      imageMeta: {},
      loading: true,
      lightboxShow: false,
      lightboxIndex: 0,
      callback: null,
      copyText: ""
    }
  },
  computed: {
    max() {
      return this.$attrs["input-max"] ? parseInt(this.$attrs["input-max"]) : 10
    },
    min() {
      return typeof this.$attrs["input-min"] != "undefined"
        ? parseInt(this.$attrs["input-min"])
        : typeof this.$attrs["required"] != "undefined"
        ? 1
        : 0
    },
    dest() {
      return this.$attrs["input-destination"]
        ? this.$attrs["input-destination"]
        : `/media/__month/__name.__ext`
    },
    isRequired() {
      return typeof this.$attrs["required"] != "undefined" ? true : false
    }
  },

  mounted() {
    this.$events.$on("uploadImage", ({ selector, callback }) => {
      if (selector == this.selector) {
        this.callback = callback
        this.$refs.multiImageInput.click()
      }
    })

    this.$watch(
      `value`,
      function(v) {
        this.setImages(v)
        this.setValidity()
      },
      { deep: true, immediate: true }
    )

    this.dom()
  },
  methods: {
    doCallback(img) {
      if (this.callback && typeof this.callback == "function") {
        this.callback(img)
        this.callback = null
      }
    },
    copyUrl(path) {
      this.copyText = path
      this.$refs.copyInput.select()

      document.execCommand("copy")

      this.$events.$emit("notify", "Url Copied")
    },
    styleImageBG(img) {
      const { preview, url } = img
      return preview || url
        ? { backgroundImage: `url(${preview || url})` }
        : {}
    },
    setValidity() {
      let validity = ""

      if (this.images.length < this.min) {
        validity = `Please upload at least ${this.min} images.`
      } else if (this.images.length > this.max) {
        validity = `Please submit maximum ${this.max} images.`
      }

      this.$emit("update:customValidity", validity)
    },
    dom() {
      const jq = this.$jquery(this.$el)
      const dropEl = jq.find(".image-drop")
      this.imgInput = jq.find(`.input-upload`)

      dropEl.on("dragenter", e => {
        dropEl.addClass("dragover")
      })
      dropEl.on("dragleave", e => {
        dropEl.removeClass("dragover")
      })
      dropEl.on("drop", e => {
        dropEl.removeClass("dragover")
      })

      jq.on("dragover", e => {
        e.stopPropagation()
        e.preventDefault()
      })
      jq.on("drop", e => {
        e.stopPropagation()
        e.preventDefault()
        dropEl.removeClass("dragover")

        this.handleMultiImage(e.originalEvent.dataTransfer.files)
      })

      if (this.max > 1) {
        Sortable.create(this.$refs.organizer, {
          filter: ".ignore-sortable",
          ghostClass: "sortable-ghost",
          onUpdate: e => {
            if (this.images[e.oldIndex]) {
              const moved = this.images.splice(e.oldIndex, 1)
              this.images.splice(e.newIndex, 0, moved[0])

              this.updateValue()
            }
          },
          onMove: e => {
            if (this.$jquery(e.related).hasClass("ignore-sortable")) {
              return false
            }
          }
        })
      }
    },

    setImages(v) {
      if (this.images.length == 0 && Array.isArray(v) && v.length > 0) {
        this.images = v.map(img => {
          if (typeof img == "string") {
            return { url: img }
          } else {
            return img
          }
        })
      }

      // Delay loading by amount of images to prevent interface lag
      setTimeout(() => {
        this.loading = false
      }, 50 + 50 * this.images.length)
    },
    updateValue() {
      const output = []

      this.images.forEach(img => {
        if (img.url) {
          delete img.preview
          delete img.status
          delete img.progress

          output.push(Object.assign({}, img))
        }
      })

      this.$emit("input", output)

      this.$emit("update:customValidity", this.validity)

      // Delay autosave to make sure all models are correct
      setTimeout(() => {
        this.$emit("autosave", output)
      }, 100)
    },
    removeImage(path = "", index) {
      // If no path provided, we can't delete
      if (path) {
        this.$storage.delete({ path })
      }

      this.$delete(this.images, index)
      this.updateValue()
    },
    handleMultiUpload(e) {
      this.handleMultiImage(e.target.files)
    },
    async handleMultiImage(files) {
      this.numFiles = 0
      if (files[0] && this.max == 1 && this.images.length >= 1) {
        this.removeImage(this.images[0].path, 0)
      }

      for (let file of files) {
        if (this.images.length < this.max) {
          const guid = this.$guid()

          const img = {
            guid,
            type: file.type,
            ext: file.name.split(".").pop(),
            size: file.size,
            name: file.name,
            uid: this.$uid,
            status: "preprocess"
          }

          img.path = this.$storage.createPath(this.dest, img)

          let index = this.images.push(img) - 1

          this.numFiles++
          this.uploadFile({
            file,
            index,
            path: img.path
          })
        }
      }
    },

    uploadFile({ file, index, path }) {
      this.uploadedFiles = 0
      const item = this.images[index]

      this.$emit("upload", { file, index, path, item })

      this.$storage.upload({
        path,
        file,
        preprocess: ({ mode, percent, preview = false }) => {
          //   this.$set(item, "progress", percent)
          if (preview) {
            this.$set(item, "preview", preview)
          } else {
            this.$set(item, "status", "preprocess")
          }
        },
        change: upload => {
          this.$set(item, "status", "progress")
          this.$set(
            item,
            "progress",
            (upload.bytesTransferred / upload.totalBytes) * 100
          )
        },
        error: error => {
          this.$set(item, "status", "error")
          this.$set(item, "message", error.message)
        },
        done: url => {
          // preload
          var img = new Image()
          img.src = url
          this.$set(item, "url", url)
          this.$set(item, "status", "complete")
          this.uploadedFiles++

          this.doCallback(item)

          if (this.uploadedFiles >= this.numFiles) {
            setTimeout(() => {
              this.updateValue()
            }, 500)
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.image-upload-input {
  .validity {
    position: absolute;
    height: 0;
    width: 0;
    left: 50%;
  }

  flex-basis: 100%;
  max-width: 100%;
  position: relative;
  .image-organizer {
    display: flex;
    flex-wrap: wrap;

    &.hidden {
      display: none;
    }
    opacity: block;
    transition: opacity 0.5s;
    .sort-img.image-uploaded:first-child .image-item-content {
      //border: 3px solid rgba(0, 0, 0, 0.3);
      position: relative;
      &:after {
        opacity: 1;
        text-align: center;
        content: "Primary";
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
        font-size: 10px;
        line-height: 1.6;
        transition: 0.2s opacity;
      }
      &:hover:after {
        opacity: 0.8;
      }
    }
  }
}
.image-item {
  // flex-basis: 20%;
  width: 65px;
  height: 65px;
  position: relative;

  margin: 0 7px 7px 0;
  display: block;
  &.sort-img {
    cursor: grab;
  }

  .image-item-pad {
    width: 100%;
    height: 100%;
  }
  &:hover .status.trash {
    opacity: 1;
  }
}
.image-upload-container {
  .invisible-copy {
    position: absolute;
    left: -9999px;
  }
}
.image-upload-container .status {
  line-height: 1.2;
  text-align: center;
  position: relative;
  .icon {
    font-size: 1.3em;
  }

  &.overlay {
    transition: all 0.4s;
    color: #fff;
    border-radius: 2px;
    .fa {
      line-height: 1.2em;
      width: 1.2em;
    }
    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.4);
    }
  }
  &.trash,
  &.complete,
  &.copy-url {
    margin: 2px;
  }

  &.trash,
  &.copy-url {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }

  &.progress,
  &.preprocess {
    height: 5px;
    width: 80%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 10%;
    left: 10%;
    .bar {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(255, 255, 255, 1);
      width: 0%;
      height: 100%;
      border-radius: 8px;
      transition: width 0.8s;
      transition: all 0.2s;
    }
  }
}
.image-item-content {
  transition: 0.1s all;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
  display: flex;
  background-color: #f7f7f7;
  .status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  &.preprocess {
    background-color: #0496ff;
  }

  &.no-status {
    align-items: flex-start;
    justify-content: flex-start;
  }
  &.dragover,
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 15px rgba(0, 0, 0, 0.1);
    cursor: move;
  }
  &:active,
  &:focus {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    color: #0496ff;
  }
}
.image-drop .image-item-content {
  text-align: center;
  position: relative;
  color: @color-placeholder;
  background-color: @factor-input-bg;
  box-shadow: @factor-input-shadow;
  border-radius: 4px;

  .upload-icon {
    border-radius: 50%;

    width: 1.5em;
    height: 1.5em;
    line-height: 1.5em;
    font-size: 1.5em;
    display: inline-block;
  }
  .upload-status {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }

  &.dragover,
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  &:active,
  &:focus {
    opacity: 1;
  }
  .input-upload {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1000;
  }
}
</style>
