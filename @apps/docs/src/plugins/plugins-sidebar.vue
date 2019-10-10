<template>
  <div class="plugins-sidebar">
    <div class="sidebar-inner">
      <section class="plugins-popular">
        <header class="section-header">
          <h1 class="title">Popular</h1>
        </header>
        <section-plugins :limit="4" :show-author="false" :show-categories="false" :text="false" />
      </section>

      <section class="plugins-new">
        <header class="section-header">
          <h1 class="title">New</h1>
        </header>
        <section-plugins :limit="4" :show-author="false" :show-categories="false" :text="false" />
      </section>

      <section class="plugins-updated">
        <header class="section-header">
          <h1 class="title">Recently Updated</h1>
        </header>
        <section-plugins :limit="4" :show-author="false" :show-categories="false" :text="false" />
      </section>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "section-plugins": () => import("./section-plugins")
  }
}
</script>

<style lang="less">
// Plugins Sidebar
.plugins-sidebar {
  padding: 0;

  .section-header {
    .title {
      font-size: 1.6em;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;

      @media (max-width: 900px) {
        font-size: 1.7em;
        line-height: 1.2;
      }
    }
  }

  .plugins-popular {
    .section-header {
      margin: 0 0 1rem;
    }
  }
  .plugins-new,
  .plugins-updated {
    .section-header {
      margin: 3rem 0 1rem;
    }
  }

  // Popular, New, & Recently Updated
  .section-plugins .entry-plugin {
    grid-template-columns: auto 3fr;
    grid-gap: 1rem;
    margin-bottom: 1rem;
    .entry-image {
      height: 70px;
      width: 70px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
      img {
        max-width: 60%;
      }
    }
    .title {
      font-size: 1.2rem;
      margin-bottom: 5px;
    }
    @media (max-width: 900px) {
      grid-template-columns: 1fr 3fr;
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &:hover {
        box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.07),
          0px 18px 26px rgba(80, 102, 119, 0.16);
        transform: translateY(-0.4rem);
      }

      .entry-image {
        height: 130px;
        width: auto;
        border-radius: 0;
        box-shadow: none;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
      }
      .title {
        font-size: 1.6em;
      }
    }
  }
}
</style>
