<template>
  <component :is="templateLoader" :post-id="_id" :post="post" :post-type="postType">
    <template #edit>
      <dashboard-pane v-for="(item, i) in editComponents" :key="i" :title="item.name">
        <component :is="item.component" v-model="post" :post-id="_id" />
      </dashboard-pane>
    </template>
  </component>
</template>
<script>
import { applyFilters, stored, storeItem } from "@factor/tools"
import { requestPostSingle, postTypeMeta } from "@factor/post"
export default {
  computed: {
    post: {
      get() {
        return stored(this._id) || {}
      },
      set(v) {
        storeItem(this._id, v)
      }
    },
    _id() {
      return this.$route.query._id || ""
    },
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeMeta() {
      return postTypeMeta(this.postType)
    },
    templateLoader() {
      const { editTemplate } = this.postTypeMeta

      return editTemplate ? editTemplate : () => import("./posts-edit.vue")
    },
    editComponents() {
      const components = applyFilters("post-edit-components", [])

      return components.filter(
        ({ postType }) => !postType || (postType && postType.includes(this.postType))
      )
    }
  },
  watch: {
    $route: function() {
      if (!this._id) this.requestPost()
    }
  },

  mounted() {
    this.requestPost()
  },
  methods: {
    async requestPost() {
      const post = await requestPostSingle({
        _id: this._id,
        postType: this.postType,
        createOnEmpty: true,
        depth: 100
      })

      // If a new post was started, an id comes with it.
      if (post._id != this._id) {
        this.$router.replace({
          query: { ...this.$route.query, _id: post._id }
        })
      }
    }
  }
}
</script>
