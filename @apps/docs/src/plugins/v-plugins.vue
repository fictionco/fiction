<template>
  <div class="plugins-container">
    <widget-header :title="`Factor Plugin Library`">
      <p slot="subtitle">Extend your project features and do more with Factor.</p>
      <figure-plugins slot="figure" />
    </widget-header>

    <div class="plugins-wrap content-pad">
      <div class="content">
        <section class="plugins-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <plugins-index :category="'featured'" />
        </section>

        <div class="plugins-search-wrap">
          <factor-input-wrap
            format="vertical"
            input="factor-input-text"
            :placeholder="`Search Factor plugins`"
            required
            label="Search"
          />
          <!-- v-model="post.gender" -->
          <factor-input-wrap
            :list="['seo', 'Utilities', 'Jobs', 'Comments', 'Syntax']"
            input="factor-input-select"
            :placeholder="`All Categories`"
            label="Categories"
          />
        </div>
        <section class="plugins-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <plugins-index />
        </section>
      </div>
      <div class="sidebar">
        <plugins-sidebar />
      </div>
    </div>

    <section>
      <div class="content-pad">
        <div class="plugins-cta">
          <div class="text">
            <h2 class="title">Create and Submit Your Plugin</h2>
            <h2 class="title-sub">
              Learn about extension development and how to submit your extension to the
              Factor library.
            </h2>
          </div>

          <div class="buttons">
            <factor-link btn="primary" path="/guide/">Submit Plugin &rarr;</factor-link>
            <factor-link btn="default" path="/guide/create-plugins">Create Plugin &rarr;</factor-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "plugins-sidebar": () => import("./plugins-sidebar"),
    "figure-plugins": () => import("./figure-plugins"),
    "plugins-index": () => import("./plugins-index")
  },
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: "Factor Plugin Library",
      description: "Extend your project features and do more with Factor."
    }
  },
  computed: {
    headerFigure() {
      return () => import("./figure-plugins.vue")
    }
  },
  routeClass() {
    //return ["nav-light"]
  }
}
</script>
<style lang="less">
.plugins-container {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
  background-color: #f6f9fc;
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  /* HEADER */
  .header {
    background-image: url("./img/dot.svg");
    overflow: hidden;

    .content-pad {
      display: grid;
      grid-template-columns: 4fr 3fr;
    }

    .header-content {
      padding: 4em 0;

      .page-title {
        font-size: 3.5em;
        line-height: 1.1;
        font-weight: 500;
        margin: 0 0 1rem;
        letter-spacing: -0.03em;
      }
      .page-title-sub {
        font-size: 1.6em;
        opacity: 0.7;
      }
      @media (max-width: 900px) {
        padding: 3rem 0;
        .page-title {
          font-size: 1.7em;
          line-height: 1.3;
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.1;
        }
      }
    }

    .header-figure {
      position: relative;
    }

    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
      }
    }
  }

  /* PAGE CONTENT */
  .plugins-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    padding-top: 4rem;

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

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  //  ENTRIES FEATURED
  .plugins-featured {
    .section-header {
      margin: 0 0 1.5rem;
    }
    .plugins-index .entry-plugin {
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      &:hover {
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
        transform: translateY(-0.4rem);
      }
      .entry-image {
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
      }
    }
  }

  //  ENTRIES ALL
  .plugins-all {
    .section-header {
      margin: 4rem 0 1.5rem;
    }
    .plugins-index .entry-plugin {
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      &:hover {
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
        transform: translateY(-0.4rem);
      }
      .entry-image {
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
      }
    }
  }

  /* CTA */
  .plugins-cta {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 2rem 0 0;
    padding: 3rem 0;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
    .text h2 {
      &.title {
        color: var(--color-primary);
      }
      font-size: 1.5em;
    }
    .buttons {
      margin: 0 0 0 20px;
      .btn-link + .btn-link {
        margin-left: 1rem;
      }
      @media (max-width: 900px) {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>
