<template>
  <div class="view-plugins">
    <section class="header">
      <div class="content-pad">
        <div class="header-content">
          <h1 class="page-title">Factor Plugin Library</h1>
          <h3 class="page-title-sub">Extend your project features and do more with Factor.</h3>
        </div>
        <div class="header-figure">
          <figure-plugins />
        </div>
      </div>
    </section>

    <div class="plugins-container content-pad">
      <div class="content">
        <section class="plugins-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <section-plugins :category="'featured'" />
        </section>

        <section class="plugins-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <section-plugins />
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
            <factor-link btn="primary" path="/guide/">Submit a Plugin &rarr;</factor-link>
            <factor-link btn="default" path="/guide/create-plugins">Create a Plugin &rarr;</factor-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "plugins-sidebar": () => import("./plugins-sidebar"),
    "figure-plugins": () => import("./figure-plugins"),
    "section-plugins": () => import("./section-plugins")
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
  routeClass() {
    //return ["nav-light"]
  }
}
</script>
<style lang="less">
.view-plugins {
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
  .plugins-container {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 2rem;
    padding-top: 3rem;

    .section-header {
      .title {
        font-size: 1.6em;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: -0.02em;

        @media (max-width: 670px) {
          font-size: 2em;
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
      margin: 0 0 1rem;
    }
    .section-plugins .post {
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
      .post-image {
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
      }
    }
  }

  //  ENTRIES ALL
  .plugins-all {
    .section-header {
      margin: 4rem 0 1rem;
    }
    .section-plugins .post {
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
      .post-image {
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
    @media (max-width: 767px) {
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
      @media (max-width: 767px) {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>
