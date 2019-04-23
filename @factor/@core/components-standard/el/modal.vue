<template>
  <div v-if="vis" class="el-modal" :class="modalClass" data-test="modal-window">
    <div class="el-modal-wrap">
      <div v-show="vis" class="el-modal-content" @click.stop>
        <div class="el-modal-pad modal-content" data-test="modal-content">
          <span class="close" @click.stop="close">
            <factor-icon icon="remove" />
          </span>
          <div class="modal-text">
            <div class="modal-text-content">
              <div class="modal-header">
                <h3 class="title">{{ title }}</h3>
                <div class="sub-title">{{ sub }}</div>
              </div>

              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    vis: { type: Boolean, default: false },
    title: { type: String, default: "" },
    sub: { type: String, default: "" },
    modalClass: { type: String, default: "" }
  },
  watch: {
    $route(to, from) {
      this.close()
    },
    vis: function(v) {
      this.handleCloseEvents(v)
      this.$events.$emit("modal", v)
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      // Append to Body
      this.$jquery(this.$el).remove()
      document.querySelector("#app").append(this.$el)
    })
  },
  methods: {
    escapeHandler(e) {
      if (e.keyCode === 27) {
        this.close()
        window.removeEventListener("keydown", this.escapeHandler)
      }
    },
    clickHandler(e) {
      this.close()
      window.removeEventListener("click", this.clickHandler)
    },
    close: function() {
      this.$emit("update:vis", false)
      this.$emit("close")
    },
    handleCloseEvents(visible) {
      if (visible) {
        setTimeout(() => {
          window.addEventListener("keydown", this.escapeHandler)
          window.addEventListener("click", this.clickHandler)
        }, 200)
      } else {
        window.removeEventListener("keydown", this.escapeHandler)
        window.removeEventListener("click", this.clickHandler)
      }
    }
  }
}
</script>
<style lang="less">
.el-modal {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  -webkit-transform: translate3d(0, 0, 0);

  //background-color: rgba(0, 0, 0, 0.75);
  background-color: rgba(0, 0, 0, 0.7);
  .el-modal-wrap {
    height: 100%;
  }
  .el-modal-content {
    border-radius: 5px;

    padding: 4em 0;
    margin: 0 auto;
    width: 90%;
    max-width: 500px;
    min-height: 300px;
    font-weight: 600;
    @media screen and (max-width: 550px) {
      width: 100%;
      height: 100%;
      padding: 0;
      .el-modal-pad.modal-content {
        border-radius: 0;
        height: 100%;
      }
    }
    .el-modal-pad {
      position: relative;
      padding: 3em;
      background: #fff;
      border-radius: 0.5em;
      .close {
        position: absolute;
        z-index: 50;
        right: 0.5em;
        top: 0.5em;
        display: block;

        opacity: 0.3;
        font-size: 1.7em;
        line-height: 1;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          opacity: 1;
          color: #ff0076;
          transform: rotate(90deg);
        }
      }
    }
    .modal-text {
      text-align: left;
      display: flex;
      &.center {
        margin: 3em auto;
        padding: 0;
      }
      .modal-text-icon {
        flex-basis: 100px;
        margin-right: 2em;
      }
      .modal-text-content {
        flex-basis: 100%;
        text-align: center;
        .errors {
          text-align: center;
        }
      }

      .actions {
        margin-top: 2em;
        .fi-btn {
          margin-right: 1em;
        }
      }
    }
    textarea {
      border: none;
      width: 100%;
      resize: none;
      padding: 1em;
      height: 10em;
      font-size: 1.1em;
    }
    .footer {
      //position: absolute;
      bottom: 0;
      text-align: right;
      width: 100%;
      left: 0;
      padding: 8px;
      border-top: 1px solid #eee;
    }
  }
}

@media screen and (max-width: 767px) {
  .el-modal {
    .el-modal-content {
      border-radius: 0;
      max-width: none;
      .el-modal-pad {
        padding: 2em;
      }
    }
  }
}
</style>
