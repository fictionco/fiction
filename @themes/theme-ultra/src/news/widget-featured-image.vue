<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="link(post._id)" class="image-wrap">
    <!-- <div class="featured-image" :style="style" /> -->
    <img v-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="image" />
    <div class="header-content">
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15 28C22.1797 28 28 22.1797 28 15C28 7.8203 22.1797 2 15 2C7.8203 2 2 7.8203 2 15C2 22.1797 7.8203 28 15 28ZM15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z"
          class="link-icon"
        />
        <path
          d="M20.9303 18.1428C20.9303 18.366 20.841 18.5803 20.6803 18.741L19.3678 20.0445C19.2071 20.1963 18.9839 20.2767 18.7607 20.2767C18.5375 20.2767 18.3143 20.1963 18.1535 20.0356L16.3143 18.1874C16.1535 18.0267 16.0643 17.8035 16.0643 17.5803C16.0643 17.3124 16.1714 17.107 16.3589 16.9285C16.6535 17.2231 16.9035 17.5713 17.3589 17.5713C17.8321 17.5713 18.216 17.1874 18.216 16.7142C18.216 16.2588 17.8678 16.0088 17.5732 15.7142C17.7518 15.5267 17.9571 15.4285 18.216 15.4285C18.4393 15.4285 18.6625 15.5178 18.8232 15.6785L20.6803 17.5356C20.841 17.6963 20.9303 17.9106 20.9303 18.1428ZM14.6535 11.8481C14.6535 12.116 14.5464 12.3213 14.3589 12.4999C14.0643 12.2053 13.8143 11.857 13.3589 11.857C12.8857 11.857 12.5018 12.241 12.5018 12.7142C12.5018 13.1695 12.85 13.4195 13.1446 13.7142C12.966 13.9017 12.7607 13.991 12.5018 13.991C12.2785 13.991 12.0553 13.9106 11.8946 13.7499L10.0375 11.8928C9.87675 11.732 9.78747 11.5178 9.78747 11.2856C9.78747 11.0624 9.87675 10.8481 10.0375 10.6874L11.35 9.38382C11.5107 9.23204 11.7339 9.14275 11.9571 9.14275C12.1803 9.14275 12.4035 9.23204 12.5643 9.39275L14.4035 11.241C14.5643 11.4017 14.6535 11.6249 14.6535 11.8481ZM22.6446 18.1428C22.6446 17.4553 22.3857 16.8124 21.8946 16.3213L20.0375 14.4642C19.5553 13.982 18.8946 13.7142 18.216 13.7142C17.5107 13.7142 16.85 13.9999 16.3589 14.4999L15.5732 13.7142C16.0732 13.2231 16.3589 12.5535 16.3589 11.8481C16.3589 11.1695 16.1 10.5178 15.6178 10.0356L13.7785 8.1874C13.2964 7.69632 12.6446 7.42847 11.9571 7.42847C11.2785 7.42847 10.6268 7.6874 10.1446 8.16954L8.83211 9.47311C8.34997 9.94632 8.07318 10.607 8.07318 11.2856C8.07318 11.9731 8.33211 12.616 8.82318 13.107L10.6803 14.9642C11.1625 15.4463 11.8232 15.7142 12.5018 15.7142C13.2071 15.7142 13.8678 15.4285 14.3589 14.9285L15.1446 15.7142C14.6446 16.2053 14.3589 16.8749 14.3589 17.5803C14.3589 18.2588 14.6178 18.9106 15.1 19.3928L16.9393 21.241C17.4214 21.732 18.0732 21.9999 18.7607 21.9999C19.4393 21.9999 20.091 21.741 20.5732 21.2588L21.8857 19.9553C22.3678 19.482 22.6446 18.8213 22.6446 18.1428Z"
          class="link-icon"
        />
      </svg>

      <h1 class="entry-title">{{ post.title }}</h1>
    </div>
  </factor-link>

  <div v-else class="featured-image-wrap">
    <img v-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="featured-image" />
  </div>
</template>
<script>
import { link } from "@factor/post"
export default {
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    avatar() {
      return this.$store.val(this.post.avatar) || {}
    },
    avatarUrl() {
      return this.avatar.url || ""
    },
    style() {
      const style = {}

      style.backgroundImage = `url(${this.avatarUrl})`

      return style
    }
  },
  methods: {
    link
  }
}
</script>
<style lang="less">
.news-posts {
  .image-wrap {
    display: block;
    position: relative;
    line-height: 0.8;
    overflow: hidden;
    &:hover .header-content {
      opacity: 1;
      transform: translateY(0);
    }
    .image {
      max-width: 100%;
    }
    .header-content {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 1.5em;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 1.6;
      opacity: 0;
      transform: translateY(1em);
      transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
      svg {
        width: 30px;
        .link-icon {
          fill: var(--color-text-light);
        }
      }
      .entry-title {
        color: var(--color-text-light);
        font-size: 1.4rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: -0.03em;
      }
    }
  }
}

.news-single-entry {
  .featured-image-wrap {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: -40px auto 2em;

    @media (max-width: 900px) {
      margin: 0 auto 2em;
    }

    .featured-image {
      display: block;
      width: 100%;

      box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
        0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
      border-radius: 4px;
    }
  }
}
</style>
