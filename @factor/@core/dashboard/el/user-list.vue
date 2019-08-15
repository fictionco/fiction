<template>
  <div class="user-list-input">
    <div class="user-list-items">
      <div v-for="(_id, index) in authors" :key="index" class="added-user">
        <dashboard-user-card class="custom-list-item" :post-id="_id" @remove="deleteItem(index)" />
      </div>
      <div class="input-text">
        <dashboard-input
          v-model="newAuthor"
          :list="potentialAuthors"
          input="factor-input-select"
          placeholder="Select Author"
          @change="addAuthor($event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    customValidity: { type: String, default: "" },
    value: { type: Array, default: () => [] },
    placeholder: { type: String, default: "Search" }
  },
  data() {
    return {
      potentialAuthors: [],
      newAuthor: "",
      searchResults: [],
      authors: [],
      toggle: false
    }
  },
  watch: {
    authors: {
      handler: function(v) {
        this.$emit("input", v)
      },
      deep: true
    },
    value: {
      handler: function(v) {
        if (v && v != this.authors) {
          this.authors = v
        }
      },
      immediate: true
    }
  },

  async mounted() {
    const posts = await this.$post.getList({
      postType: "user",
      conditions: { accessLevel: { $gt: 99 } },
      options: { limit: 100 }
    })

    this.potentialAuthors = posts.map(_ => {
      return { name: `${_.displayName} (${_.email})`, value: _._id }
    })
  },
  methods: {
    addAuthor() {
      if (!this.authors.includes(this.newAuthor)) {
        this.authors.push(this.newAuthor)
      }

      this.newAuthor = ""
    },
    deleteItem(index) {
      this.$delete(this.authors, index)
    },

    setValidity() {
      const v = this.value
      let customValidity = ""
      if (this.min && (!v || v.length < this.min)) {
        customValidity = `Add at least ${this.min} item`
      } else if (this.max && v && v.length > this.max) {
        customValidity = `Add no more than ${this.max} items`
      }

      this.$emit("update:customValidity", customValidity)
    }
  }
}
</script>

<style lang="less">
.user-list-items {
  display: flex;
  flex-direction: column;
  .added-user {
    margin-bottom: 1em;
    .card-wrap {
      width: auto;
      max-width: 100%;
      //max-width: fit-content;
      .name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}

.card-item {
  display: flex;
  align-items: center;

  padding: 0.5em;
  margin-top: 5px;

  cursor: pointer;
  &:hover {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
  }
  .media {
    margin-right: 1em;
    img {
      width: 25px;
      height: 25px;
      display: block;
      border-radius: 50%;
    }
  }
  .text {
    font-size: 0.9em;
    text-align: left;
    line-height: 1.2;
  }
}
</style>

