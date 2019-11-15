<template>
  <div class="editor-input">
    <div class="toolbar">
      <factor-btn-dashboard size="small" @click="insert('image')">
        <factor-icon icon="image" />
      </factor-btn-dashboard>
      <factor-btn-dashboard size="small" @click="insert('link')">
        <factor-icon icon="link" />
      </factor-btn-dashboard>
      <factor-btn-dashboard size="small" @click="insert('bold')">
        <factor-icon icon="bold" />
      </factor-btn-dashboard>
      <factor-btn-dashboard size="small" @click="insert('italic')">
        <factor-icon icon="italic" />
      </factor-btn-dashboard>
    </div>
    <pre id="editor" ref="editor" class="editor" @keyup="$emit('keyup')" />
  </div>
</template>

<script>
import { factorBtnDashboard, factorIcon } from "@factor/ui"
export default {
  components: { factorBtnDashboard, factorIcon },
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
    require("scriptjs")("https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js", () => {
      this.editor = window.ace.edit("editor")
      this.session = this.editor.session
      //   editor.setTheme("ace/theme/xcode")
      this.session.setMode("ace/mode/markdown")
      this.session.setUseWrapMode(true)
      this.editor.setOptions({ showPrintMargin: false })
      this.editor.renderer.setPadding(10)
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
    })
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
    }
  }
}
</script>

<style lang="less">
.editor-input {
  .toolbar {
    margin-bottom: 1em;
  }
}
#editor {
  --color-red: #ff0076;
  --color-blue-dark: #4568b2;
  --color-blue: #0496ff;
  --color-blue-light: #62bdff;
  --color-green: #26d12b;
  --color-yellow: #fdf700;
  --color-orange: #ff6464;
  --color-red: #ff0076;

  color: var(--color-text);
  box-shadow: var(--box-shadow-input);

  height: 600px;

  line-height: 1.5rem;
  font-weight: 300;

  border-radius: 4px;
  .ace_content {
    background-color: var(--input-bg);
  }
  .ace_layer .ace_cursor {
    color: var(--color-text);
    border-left: 1px solid;
    opacity: 0.4;
  }
  .ace_heading {
    font-weight: 800;
    color: var(--color-blue-dar) k;
  }
  .ace_string {
    color: var(--color-blue);
  }
  .ace_list {
    color: var(--color-blue-ligh) t;
  }

  .ace_print-margin {
    width: 1px;
    background: #e8e8e8;
  }
  .ace_marker-layer .ace_active-line {
    background: transparent;
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
    color: var(--color-blue-dark);
  }
  .ace_constant.ace_language {
    color: var(--color-blue-dark);
  }
  .ace_constant.ace_library {
    color: var(--color-green);
  }
  .ace_invalid {
    background-color: rgba(255, 0, 0, 0.1);
    border-color: rgba(255, 0, 0, 0.3);
  }

  .ace_support.ace_function {
    color: var(--color-orange);
  }
  .ace_constant {
    color: var(--color-red);
  }
  .ace_support.ace_constant {
    color: var(--color-green);
  }
  .ace_support.ace_type,
  .ace_support.ace_class .ace_support.ace_other {
    color: var(--color-blue-light);
  }
  .ace_variable.ace_parameter {
    font-style: italic;
    color: var(--color-orange);
  }
  .ace_keyword.ace_operator {
    color: rgb(104, 118, 135);
  }
  .ace_comment {
    color: var(--color-green);
    .ace_doc {
      color: var(--color-green);
    }
    .ace_doc.ace_tag {
      color: var(--color-green);
    }
  }

  .ace_constant.ace_numeric {
    color: var(--color-blue);
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
