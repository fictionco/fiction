<template>
  <div class="user-list-input">
    <div class="user-list-items">
      <div v-for="(uid, index) in items" :key="index" class="added-user">
        <factor-card-user class="custom-list-item" :uid="uid" @remove="deleteItem(index)" />
      </div>
      <div class="input-text">
        <input
          ref="addNew"
          v-model="searchText"
          type="text"
          placeholder="Search Users"
          @input="searchUsers($event)"
        >
      </div>
    </div>
    <div class="search-area">
      <factor-pop :toggle.sync="toggle">
        <div class="custom-list-actions">
          <div v-if="searchResults.length > 0" class="search-results">
            <div class="res">
              <div
                v-for="(user, index) in searchResults"
                :key="index"
                class="search-result card-item"
                @click="addItem(user.uid)"
              >
                <div class="media">
                  <img :src="user.photoURL">
                </div>
                <div class="text">{{ user.displayName }}</div>
              </div>
            </div>
          </div>
          <div v-else class="no-results">No Results</div>
        </div>
      </factor-pop>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    customValidity: { type: String, default: "" },
    value: { type: Array, default: () => [] },
    filters: { type: String, default: "" },
    placeholder: { type: String, default: "Search" }
  },
  data() {
    return {
      searchText: "",
      searchResults: [],
      items: [],
      toggle: false
    }
  },
  computed: {
    min() {
      if (typeof this.$attrs["input-min"] != "undefined") {
        return parseInt(this.$attrs["input-min"])
      } else if (typeof this.$attrs["required"] != "undefined") {
        return 1
      } else {
        return 0
      }
    },
    max() {
      return this.$attrs["input-max"]
        ? parseInt(this.$attrs["input-max"])
        : 100000
    }
  },

  mounted() {
    this.$watch(
      `value`,
      function(v) {
        if (v && !this.$lodash.isEqual(v, this.items)) {
          this.items = v
        }
      },
      { immediate: true, deep: true }
    )

    this.$watch(
      `items`,
      function(v) {
        if (v && !this.$lodash.isEqual(v, this.value)) {
          this.$emit("input", v)
        }
        this.setValidity()
      },
      { immediate: true, deep: true }
    )
  },
  methods: {
    async searchUsers() {
      if (this.searchText) {
        const results = await this.$db.search({
          collection: "public",
          type: "users"
        })
        this.searchResults = results.filter(_ => _.displayName && _.photoURL)
      } else {
        this.searchResults = []
      }

      this.toggle = !!this.searchText
    },
    sendItem(e) {
      e.preventDefault()
      this.addItem()
    },
    addItem(uid) {
      this.toggle = false
      this.items.push(uid)

      this.searchText = ""
      this.searchResults = []
    },
    deleteItem(index) {
      this.$delete(this.items, index)
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
  .added-user {
    margin-bottom: 1em;
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

