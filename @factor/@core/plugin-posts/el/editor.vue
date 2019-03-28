<template>
  <div class="editor-input">
    <div class="toolbar">
      <factor-btn size="small" @click="insert('image')">
        <i class="fa fa-image" />
      </factor-btn>
      <factor-btn size="small" @click="insert('link')">
        <i class="fa fa-link" />
      </factor-btn>
      <factor-btn size="small" @click="insert('bold')">
        <i class="fa fa-bold" />
      </factor-btn>
      <factor-btn size="small" @click="insert('italic')">
        <i class="fa fa-italic" />
      </factor-btn>
    </div>
    <pre id="editor" ref="editor" class="editor" @keyup="$emit('keyup')" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: { type: String, default: "" }
  },
  data() {
    return {
      editor: null,
      session: null,
      content: ""
    }
  },
  computed: {},

  mounted() {
    require("scriptjs")(
      "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js",
      () => {
        this.editor = ace.edit("editor")
        this.session = this.editor.session
        //   editor.setTheme("ace/theme/xcode")
        this.session.setMode("ace/mode/markdown")
        this.session.setUseWrapMode(true)
        this.editor.setOptions({ showPrintMargin: false })
        this.editor.renderer.setShowGutter(false)
        this.$watch(
          "value",
          function(v) {
            if (v != this.content) {
              this.session.setValue(this.value)
            }
          },
          { immediate: true }
        )

        this.session.on("change", () => {
          this.content = this.editor.getValue()
          this.$emit("input", this.content)
        })
      }
    )
  },
  methods: {
    insert(item) {
      if (item == "image") {
        this.editor.insert(`![${this.editor.getSelectedText()}](https://...)`)
      } else if (item == "link") {
        this.editor.insert(`[${this.editor.getSelectedText()}](https://...)`)
      } else if (item == "bold") {
        this.editor.insert(`**${this.editor.getSelectedText()}**`)
      } else if (item == "italic") {
        this.editor.insert(`*${this.editor.getSelectedText()}*`)
      }

      // this.$hook.$emit("uploadImage", {
      //   callback: img => {
      //     console.log("FO FROM EDITOR")

      //   }
      // })
    }
  }
}
</script>

<style lang="less">
@color-red: #ff0076;
@color-blue-dark: #4568b2;
@color-blue: #0496ff;
@color-blue-light: #62bdff;
@color-green: #26d12b;
@color-yellow: #fdf700;
@color-orange: #ff6464;
@color-red: #ff0076;

.editor-input {
  .toolbar {
    margin-bottom: 1em;
  }
}
#editor {
  height: 600px;

  font-weight: 400;
  line-height: 1.5rem;
  font-weight: 300;
  box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: #506677;

  .ace_heading {
    font-weight: 800;
    color: @color-blue-dark;
  }
  .ace_string {
    color: @color-blue;
  }
  .ace_list {
    color: @color-blue-light;
  }
  .ace_gutter {
    background: #fff;
    color: #ddd;
    overflow: hidden;
    border-right: 1px solid rgba(62, 62, 62, 0.1);
  }
  .ace_print-margin {
    width: 1px;
    background: #e8e8e8;
  }
  .ace_gutter-active-line {
    background-color: #f3f5fa;
  }
  .ace_strong,
  .ace_constant,
  .ace_heading {
    font-weight: 600;
  }
  .ace_markup.ace_heading {
    font-weight: 400;
  }
  .ace_emphasis,
  .ace_list {
    font-style: italic;
  }
  .ace_markup.ace_list {
    font-style: normal;
  }

  .ace_cursor {
    color: black;
  }
  .ace_invisible {
    color: rgb(191, 191, 191);
  }
  .ace_constant.ace_buildin {
    color: @color-blue-dark;
  }
  .ace_constant.ace_language {
    color: @color-blue-dark;
  }
  .ace_constant.ace_library {
    color: @color-green;
  }
  .ace_invalid {
    background-color: rgba(255, 0, 0, 0.1);
    border-color: rgba(255, 0, 0, 0.3);
  }

  .ace_support.ace_function {
    color: @color-orange;
  }
  .ace_constant {
    color: @color-red;
  }
  .ace_support.ace_constant {
    color: @color-green;
  }
  .ace_support.ace_type,
  .ace_support.ace_class .ace_support.ace_other {
    color: @color-blue-light;
  }
  .ace_variable.ace_parameter {
    font-style: italic;
    color: @color-orange;
  }
  .ace_keyword.ace_operator {
    color: rgb(104, 118, 135);
  }
  .ace_comment {
    color: @color-green;
    .ace_doc {
      color: @color-green;
    }
    .ace_doc.ace_tag {
      color: @color-green;
    }
  }

  .ace_constant.ace_numeric {
    color: @color-blue;
  }
  .ace_variable {
    color: rgb(49, 132, 149);
  }
  .ace_xml-pe {
    color: rgb(104, 104, 91);
  }
  .ace_entity.ace_name.ace_function {
    color: #0000a2;
  }

  .ace_marker-layer .ace_selection {
    background: rgb(181, 213, 255);
  }
  .ace_marker-layer .ace_step {
    background: rgb(252, 255, 0);
  }
  .ace_marker-layer .ace_stack {
    background: rgb(164, 229, 101);
  }
  .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid rgb(192, 192, 192);
  }
  .ace_marker-layer .ace_active-line {
    background: #f7fafc;
  }

  .ace_marker-layer .ace_selected-word {
    background: rgb(250, 250, 255);
    border: 1px solid rgb(200, 200, 250);
  }
  .ace_storage,
  .ace_keyword,
  .ace_meta.ace_tag {
    color: rgb(147, 15, 128);
  }

  .ace_string.ace_regex {
    color: rgb(255, 0, 0);
  }
  .ace_entity.ace_other.ace_attribute-name {
    color: #994409;
  }
  .ace_indent-guide {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==")
      right repeat-y;
  }
}
</style>
