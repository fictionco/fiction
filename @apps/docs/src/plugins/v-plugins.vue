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
          <section-plugins />
        </section>
      </div>
      <div class="sidebar">
        <plugins-sidebar />
        <section-plugins />
      </div>
    </div>
    <h2>CTA will go here</h2>
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
    grid-template-columns: 3fr 1fr;
    grid-gap: 2rem;
    padding-top: 3rem;
    padding-bottom: 3rem;

    .section-header {
      margin-bottom: 2rem;
      .title {
        font-size: 2em;
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
}
</style>
