<template>
  <factor-form ref="form" :class="formStatus" @submit="send()">
    <h2 v-text="setting('commentizer.submitText')" />
    <div v-if="sent">
      <h3>{{ setting('commentizer.confirm.title') }}</h3>
      <div>{{ setting('commentizer.confirm.subTitle') }}</div>
    </div>
    <div v-else>
      <factor-input-wrap
        v-for="(c, i) in setting('commentizer.layout')"
        :key="i"
        v-model="form[c._id]"
        :data-test="`commentizer-${c._id}`"
        :format="setting('commentizer.inputFormat', 'horizontal')"
        :input="`factor-input-${c.inputType}`"
        :label="getLabel(c)"
        :required="!!c.required"
      />
      <factor-input-submit
        btn="primary"
        el="button"
        :loading="sending"
      >{{ setting('commentizer.submitText') }}</factor-input-submit>
    </div>
  </factor-form>
</template>

<script>
import { setting } from "@factor/tools"
import { requestPostSave } from "@factor/post"
export default {
  props: {
    postId: { type: String, required: true }
  },
  data() {
    return {
      form: {},
      formStatus: "unchecked",
      sending: false,
      sent: false
    }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  },
  async mounted() {
    this.$watch(
      "form",
      function() {
        const v = this.$refs.form.$el.checkValidity()
        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  methods: {
    setting,
    async send() {
      this.sending = true

      const newComment = await this.$commentizer.createComment(this.form)
      this.post.commentizerComments.push(newComment._id)
      requestPostSave({ post: this.post, postType: this.post.postType })

      // TODO: refresh local store after save

      this.sent = true
      this.sending = false
    },
    getLabel(c) {
      const label = [c.label]
      if (c.required) label.push("*")
      return label.join(" ")
    }
  }
}
</script>
