<template>
  <div class="image-upload-container">
    <div class="image-upload-input">
      <div ref="organizer" class="image-organizer">
        <div
          v-for="img in allImages"
          :key="img._id"
          :class="single ? 'no-sort-img' : 'sort-img'"
          class="image-item image-uploaded"
        >
          <div class="image-item-pad">
            <div
              :style="styleImageBG(img)"
              :class="img.status || 'no-status'"
              class="image-item-content"
            >
              <div class="status-bar">
                <div
                  v-if="['progress', 'preprocess', 'processing'].includes(img.status)"
                  class="image-status overlay"
                  :class="img.status"
                >
                  <div :style="{ width: `${img.progress}%` }" class="bar" />
                </div>

                <factor-menu
                  v-else
                  class="menu"
                  :list="['upload-image', 'view', 'copy-URL', 'delete']"
                  drop-direction="up"
                  @action="action(img._id, $event)"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="single || imageIds.length < maxImages"
          ref="multiImageDrop"
          class="image-item ignore-sortable image-drop"
          :class="single && (populated.length > 0 || uploading.length > 0) ? 'single-image-drop': ''"
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
              />
              <factor-loading-ring v-if="loading" width="2em" />
              <div v-else class="upload-status">
                <factor-icon icon="fas fa-plus" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input ref="copyInput" v-model="copyText" type="text" class="invisible-copy" />
    <factor-lightbox :visible.sync="lightboxShow" :imgs="populated" :index="lightboxIndex" />
  </div>
</template>
<script lang="ts">
import { factorMenu, factorLoadingRing, factorIcon, factorLightbox } from "@factor/ui"
import { HTMLInputEvent } from "@factor/ui/event-types"
import { uploadImage, requestDeleteImage } from "@factor/attachment"
import DOM from "jquery"
import { emitEvent, onEvent, stored, storeItem } from "@factor/api"
import Sortable from "sortablejs"
import { Attachment, PreUploadProperties } from "@factor/attachment/types"
import Vue from "vue"
import { guid } from "@factor/api/utils"
import { FactorPost } from "@factor/post/types"
export default Vue.extend({
  components: { factorMenu, factorLoadingRing, factorIcon, factorLightbox },
  props: {
    selector: { type: String, default: "none" },
    loading: { type: Boolean, default: false },
    value: { type: [Array, String], default: () => [] },
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 10 },
    postId: { type: String, default: "post" }
  },
  data() {
    return {
      imageIds: [],
      uploading: [],
      lightboxShow: false,
      lightboxIndex: 0,
      callback: null,
      copyText: ""
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId)
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      }
    },
    single(this: any): boolean {
      return typeof this.value == "string" || this.max == 1 ? true : false
    },
    maxImages(this: any) {
      return this.single ? 1 : Number(this.max)
    },
    isRequired(this: any) {
      return typeof this.$attrs["required"] != "undefined" ? true : false
    },
    populated(this: any): Attachment[] {
      const mapped = this.imageIds.map((_: string) => stored(_))

      return mapped.filter((_: Attachment | undefined) => _)
    },
    allImages(this: any) {
      return [...this.populated, ...this.uploading]
    }
  },

  mounted() {
    /**
     * Allow for external elements to communicate with this image uploader via a DOM selector
     */
    onEvent(
      "uploadImageWithInput",
      ({ selector, callback }: { selector: string; callback: Function }) => {
        if (selector == this.selector) {
          this.callback = callback
          this.triggerUpload()
        }
      }
    )

    /**
     * Allow external to inject an image to this input by _id
     */
    onEvent("addImageToInput", ({ selector, _id }: { selector: string; _id: string }) => {
      if (selector == this.selector) {
        this.imageIds.push(_id)
      }
    })

    this.$watch(
      `value`,
      function(this: any, v: string | string[]) {
        if (v) {
          this.imageIds = typeof v == "string" ? [v] : v
        }
      },
      { deep: true, immediate: true }
    )

    this.dom()
  },
  methods: {
    /**
     * Triggers file selector
     */
    triggerUpload(this: any) {
      this.$refs.multiImageInput.click()
    },
    /**
     * Image menu available actions
     */
    action(this: any, _id: string, action: string) {
      if (action == "view") {
        this.lightboxShow = true
        this.lightboxIndex = this.populated.findIndex((_: Attachment) => _._id == _id)
      } else if (action == "copy-URL") {
        this.copyUrl(_id)
      } else if (action == "delete") {
        const result = confirm("Are you sure? This will permanently delete this image.")
        if (result) this.removeImage(_id)
      } else if (action == "upload-image") {
        this.triggerUpload()
      }
    },
    /**
     * Copies the URL of an image based on its _id
     */
    copyUrl(this: any, _id: string): void {
      const image = this.populated.find((_: Attachment) => _._id == _id)

      if (!image || !image.url) {
        return
      }

      this.copyText = image.url.includes("base64") ? `{{${_id}.url}}` : image.url

      this.$nextTick(() => {
        this.$refs.copyInput.select()

        document.execCommand("copy")

        emitEvent("notify", "Url Copied")
      })
    },
    styleImageBG(img: Attachment) {
      const { url } = img

      return url ? { backgroundImage: `url(${url})` } : {}
    },
    setValidity(this: any): void {
      let validity = ""

      if (this.images.length < this.min) {
        validity = `Please upload at least ${this.min} images.`
      } else if (this.images.length > this.maxImages) {
        validity = `Please submit maximum ${this.maxImages} images.`
      }

      this.$emit("update:customValidity", validity)
    },
    /**
     * Fancy DOM stuff
     */
    dom(this: any): void {
      const jq = DOM(this.$el)
      const dropEl = jq.find(".image-drop")
      this.imgInput = jq.find(`.input-upload`)

      dropEl.on("dragenter", () => {
        dropEl.addClass("dragover")
      })
      dropEl.on("dragleave", () => {
        dropEl.removeClass("dragover")
      })
      dropEl.on("drop", () => {
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

        if (e.originalEvent?.dataTransfer) {
          this.handleMultiImage(e.originalEvent.dataTransfer.files)
        }
      })

      if (!this.single) {
        Sortable.create(this.$refs.organizer, {
          filter: ".ignore-sortable",
          ghostClass: "sortable-ghost",
          onUpdate: e => {
            if (e.oldIndex && this.imageIds[e.oldIndex]) {
              const moved = this.imageIds.splice(e.oldIndex, 1)
              this.imageIds.splice(e.newIndex, 0, moved[0])

              this.updateValue()
            }
          },
          onMove: e => {
            return DOM(e.related).hasClass("ignore-sortable") ? false : true
          }
        })
      }
    },

    updateValue(this: any) {
      const v = this.imageIds.filter((_id: string) => {
        return this.populated.find((_: Attachment) => _._id == _id)
      })

      let val

      // null is needed to unset an objectId in mongoose
      // also undefined doesn't trigger change
      if (this.single) {
        val = v[0] ?? null
      } else {
        val = v
      }
      this.$emit("input", val)

      this.$emit("update:customValidity", this.validity)
    },

    async removeImage(this: any, _id: string) {
      this.removeFromArrayById(_id, this.imageIds as string[])
      if (this.post && this.post.images) {
        this.removeFromArrayById(_id, this.post.images)
      }
      await requestDeleteImage({ _id })
    },
    /**
     * handle the raw upload event
     */
    handleMultiUpload(this: any, e: HTMLInputEvent) {
      this.handleMultiImage(e.target.files)
    },
    /**
     * Loop through files and upload
     * Orchestrate UI
     */
    async handleMultiImage(this: any, files: File[]) {
      this.numFiles = 0

      /**
       * If the uploader only supports ONE image, then setup deletion if existing when new is done
       */
      let replaceImage: string
      if (files[0] && this.maxImages == 1 && this.imageIds.length >= 1) {
        replaceImage = this.imageIds[0]
        this.removeFromArrayById(replaceImage, this.imageIds as string[])
      }

      for (const file of files) {
        if (this.imageIds.length < this.maxImages) {
          const _id = guid()
          const item = { status: "preprocess", _id }
          this.uploading.push(item) - 1
          this.numFiles++
          this.uploadFile({
            item,
            file,
            onError: () => {},
            onFinished: () => {
              if (replaceImage) this.removeImage(replaceImage)
            }
          })
        }
      }
    },
    /**
     * Uploads an individual file
     */
    uploadFile(
      this: any,
      {
        file,
        onFinished,
        item
      }: { item: any; file: File; index: number; onFinished: Function }
    ) {
      this.$emit("upload", { file, item })

      uploadImage({
        file,
        onPrep: ({ preview = "" }: PreUploadProperties) => {
          if (preview) {
            this.up(item._id, "url", preview)
          }
          this.up(item._id, "status", "preprocess")
        },
        onChange: (progressEvent: ProgressEvent) => {
          const { loaded, total } = progressEvent
          this.up(item._id, "status", "progress")
          this.up(item._id, "progress", (loaded / total) * 100)

          if (loaded / total >= 1) {
            this.up(item._id, "status", "processing")
          }
        },
        onError: (error: Error) => {
          this.up(item._id, "status", "error")
          this.up(item._id, "message", error.message)
        },
        onFinished: (result: Attachment) => {
          const { _id } = result

          this.pushNewImage(_id)
          this.removeFromArrayById(item._id, this.uploading as Attachment[])
          if (onFinished) {
            onFinished()
          }
        }
      })
    },

    pushNewImage(this: any, _id: string) {
      this.imageIds.push(_id)
      if (this.post && this.post.images) {
        this.$set(this.post, "images", [...this.post.images, _id])
      }
    },
    /**
     * Sets uploading object status for UI
     */
    up(this: any, _id: string, field: string, value: string) {
      const index = this.uploading.findIndex((_: Attachment) => _._id == _id)
      if (index != -1) {
        this.$set(this.uploading[index], field, value)
      }
    },

    removeFromArrayById(this: any, _id: string, theArray: Attachment[] | string[]) {
      const index = theArray.findIndex((_: Attachment | string) => {
        if (typeof _ == "string") {
          return _ == _id
        } else {
          return _._id == _id
        }
      })

      if (index != -1) {
        const valueRemoved = theArray[index]

        this.$delete(theArray, index)

        this.updateValue()

        return valueRemoved
      } else {
        return
      }
    }
  }
})
</script>

<style lang="less">
@keyframes barberpole {
  100% {
    background-position: 100% 100%;
  }
}
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
    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(30px, 60px));
    grid-gap: 10px;
    &.hidden {
      display: none;
    }

    transition: opacity 0.5s;
  }
}
.image-item {
  position: relative;

  display: block;
  &.sort-img {
    cursor: grab;
  }

  .image-item-pad {
    width: 100%;
    height: 100%;
  }
}
.image-upload-container {
  .invisible-copy {
    position: absolute;
    left: -9999px;
  }
}
.image-upload-container {
  .image-status {
    line-height: 1.2;
    text-align: center;
    position: relative;
    padding: 2px;

    line-height: 1;
    border-radius: 5px;
    opacity: 1;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    &.overlay {
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 8px;
    }
    &.success {
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
      color: #fff;
    }
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
    &.processing .bar {
      background-size: 200% 200%;
      background-image: repeating-linear-gradient(
        45deg,
        rgba(black, 0.1),
        rgba(black, 0.1) 1rem,
        transparent 1rem,
        transparent 2rem
      );
      animation: barberpole 1s linear infinite;
    }
  }
  .menu {
    height: 100%;
    width: 100%;
    .toggle-btn {
      opacity: 0;
      height: 100%;
    }
  }
}
.image-item-content {
  .loading-ring-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }
  //box-shadow: inset @factor-box-shadow-input;
  transition: 0.1s all;
  border-radius: 6px;
  width: 100%;
  padding: 50% 0;
  // height: 100%;
  position: relative;
  background-size: cover;
  background-position: 50%;

  display: flex;
  //background-color: @factor-input-bg;
  .status-bar {
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  &.preprocess {
    background-color: var(--factor-color-text);
  }

  &.dragover,
  &:hover {
    cursor: move;
  }
}
.image-drop.single-image-drop {
  opacity: 0;
}
.image-drop .image-item-content {
  text-align: center;
  position: relative;

  border-radius: 6px;

  .upload-status {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    height: 100%;
    top: 0;
  }

  &:hover {
    opacity: 0.7;
  }
  &:active,
  &:focus {
    opacity: 0.8;
  }
  .input-upload,
  .input-upload::-webkit-file-upload-button {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 40;
  }
}
</style>
