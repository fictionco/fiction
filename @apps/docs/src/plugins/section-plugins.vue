<template>
  <div class="section-plugins">
    <section
      v-for="(entry, index) in filteredEntries"
      :id="entry.id"
      :key="index"
      class="entry-plugin"
      :class="entry.class"
    >
      <div class="entry-image">
        <img v-if="entry.image" :src="require(`./img/${entry.image}`)" :alt="entry.title" />
      </div>
      <div class="entry-content">
        <h3 class="title">
          <factor-link :path="entry.permalink">{{ entry.title }}</factor-link>
        </h3>
        <div class="meta">
          <span v-if="showAuthor != false" class="author">by {{ entry.author }}</span>
          <div v-if="entry.categories.length > 0 && showCategories != false" class="categories">
            in
            <span
              v-for="(cat, ci) in filterCategories(entry.categories)"
              :key="ci"
              class="category"
            >{{ cat.name }}</span>
          </div>
          <div
            v-if="entry.downloads && entry.downloads > 0"
            class="downloads"
          >{{ entry.downloads }} downloads</div>
        </div>
        <p v-if="text != false" class="text">{{ entry.text }}</p>
        <factor-link :path="entry.permalink" class="entry-link">{{ entry.link.text }} &rarr;</factor-link>
      </div>
    </section>
  </div>
</template>

<script>
import getPlugins from "./json/entries"

export default {
  props: {
    limit: { type: Number, default: Infinity, required: false },
    showAuthor: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
    text: { type: Boolean, default: true },
    category: { type: String, default: "" }
  },
  data() {
    return {
      entriesJSON: getPlugins
    }
  },
  computed: {
    filteredEntries() {
      let entries = this.entriesJSON.entries

      // Entry Category
      if (this.category && this.category !== "") {
        entries = entries.filter(entry => {
          let foundCategory = entry.categories.findIndex(c => {
            return c.slug == this.category
          })
          return foundCategory !== -1
        })
      }

      // Entry Count
      //let entryCount = this.count
      // if (entryCount != -1) {
      //   return this.entries.slice(0, +entryCount)
      //   // Do it through filter
      //   // entries = entries.filter(entry => {
      //   // ugh
      //   // })
      // } else {
      //   return this.entries
      // }

      // Limit Post Count
      if (this.limit && this.limit !== "") {
        return entries.slice(0, this.limit)
      } else {
        return entries
      }
    }
  },

  methods: {
    filterCategories: function(items) {
      return items.filter(function(item) {
        // Don't display featured category
        return item.slug != "featured"
      })
    }
  }
}
</script>
<style lang="less">
.section-plugins {
  .entry-plugin {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 2rem;
    align-items: flex-start;
    margin-bottom: 1rem;
    &:hover {
      .entry-content .entry-link {
        transform: translateY(0);
        opacity: 1;
      }
    }
    a {
      text-decoration: none;
    }
    .entry-image {
      display: flex;
      justify-content: center;
      height: 130px;
      padding: 4px;
      border-radius: 6px;
      img {
        width: 70px;
        max-width: 100%;
      }
    }
    .entry-content {
      overflow: hidden;
      .title {
        font-size: 1.6em;
        line-height: 1.2em;
        margin-bottom: 5px;
        //font-weight: 500;
        a {
          color: var(--color-text);
          &:hover {
            color: var(--color-primary);
          }
        }
      }
      .meta {
        color: rgba(var(--color-text-rgb), 0.6);
        .categories {
          display: inline;
          .category {
            &:after {
              content: ", ";
            }
            &:last-of-type {
              &:after {
                content: initial;
              }
            }
          }
        }
      }
      .text {
        line-height: 1.7em;
        margin: 1em 0 0.5em;
      }
      .entry-link {
        display: block;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
        transform: translateY(3rem);
        opacity: 0.2;
      }
    }
  }
}
</style>
