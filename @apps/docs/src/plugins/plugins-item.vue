<template>
  <div class="entry-plugin">
    <div class="entry-image">icon.svg</div>

    <div class="entry-content">
      <!-- <pre>
      {{ entry }}
      </pre>-->
      <h3 class="title">
        <factor-link
          :path="$setting.get('plugins.postRoute') + '/' + pluginPermalink"
        >{{ pluginName }}</factor-link>
      </h3>
      <div class="meta">
        <div v-if="showAuthor != false" class="author">by {{ entry.author }}</div>
      </div>

      <p v-if="text != false" class="text">{{ entry.description }}</p>

      <div
        v-if="entry.index.data.downloads && showDownloads != false"
        class="downloads"
      >{{ entry.index.data.downloads }} downloads</div>
    </div>

    <!-- 
    OLD CODE SAVED FOR LAYOUT AND CLASSES REFERENCE
      
    <div class="entry-image">
      <img v-if="entry.image" :src="require(`./img/${entry.image}`)" :alt="entry.title" />
    </div>

    <div class="entry-content">
      <h3 class="title">
        <factor-link
          :path="$setting.get('plugins.postRoute') + '/' + entry.permalink"
        >{{ entry.title }}</factor-link>
      </h3>

      <div class="meta">
        <div v-if="showAuthor != false" class="author">by {{ entry.author }}</div>

        <div v-if="entry.categories.length > 0 && showCategories != false" class="categories">
          in
          <span
            v-for="(cat, ci) in filterCategories(entry.categories)"
            :key="ci"
            class="category"
          >{{ cat.name }}</span>
        </div>

        <div
          v-if="entry.download_count && showDownloads != false"
          class="downloads"
        >{{ entry.download_count }} downloads</div>
      </div>

      <p v-if="text != false" class="text">{{ entry.text }}</p>

      <factor-link
        :path="$setting.get('plugins.postRoute') + '/' + entry.permalink"
        class="entry-link"
      >{{ entry.link.text }} &rarr;</factor-link>
    </div>-->
  </div>
</template>

<script>
export default {
  props: {
    format: { type: String, default: "" },
    entry: { type: Object, required: true },
    limit: { type: Number, default: Infinity, required: false },
    showAuthor: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
    showDownloads: { type: Boolean, default: true },
    text: { type: Boolean, default: true },
    category: { type: String, default: "" }
  },
  data() {
    return {}
  },
  computed: {
    pluginName() {
      // Replace dashes with spaces to entry name
      let spacedName = this.entry.name.replace(/(?:^|[\s\-\_\.])/g, " ")

      // Return entry name without @factor text
      return spacedName.replace("@factor/", "")
    },
    pluginPermalink() {
      let getPermalink = this.entry.name.replace("@factor/", "")

      return getPermalink
    }
  }
}
</script>
<style lang="less">
.entry-plugin {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 2rem;
  align-items: flex-start;
  margin-bottom: 1rem;

  &:hover {
    .entry-content .title a {
      color: var(--color-primary);
    }
  }
  // &:hover {
  //   .entry-content .entry-link {
  //     transform: translateY(0);
  //     opacity: 1;
  //   }
  // }
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
      width: 50px;
      max-width: 100%;
    }
  }
  .entry-content {
    overflow: hidden;
    .title {
      font-size: 1.6em;
      line-height: 1.2em;
      margin-bottom: 5px;
      text-transform: capitalize;
      //font-weight: 500;
      a {
        color: var(--color-text);
        &:hover {
          //color: var(--color-text);
          color: var(--color-primary);
        }
      }
    }
    .meta {
      color: rgba(var(--color-text-rgb), 0.6);
      .author,
      .categories,
      .downloads {
        display: inline-block;
      }
      .categories {
        //display: inline;
        margin-right: 1rem;
        .category {
          display: inherit;
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
      // .downloads {
      //   margin-left: 1rem;
      // }
    }
    .text {
      line-height: 1.7em;
      margin: 0.5em 0;
    }
    // .entry-link {
    //   display: block;
    //   transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    //   transform: translateY(3rem);
    //   opacity: 0.2;
    //   @media (max-width: 900px) {
    //     transform: none;
    //     opacity: 1;
    //   }
    // }
  }
}
</style>
