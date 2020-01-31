<template>
  <div class="start-container">
    <div class="start-nav">
      <div class="mast">
        <nav class="nav">
          <factor-link class="active" path="/install">1. Install</factor-link>
          <factor-link path="#customize">2. Customize</factor-link>
          <factor-link path="#manage">3. Manage</factor-link>
          <factor-link path="#deploy">4. Deploy</factor-link>
        </nav>
      </div>
    </div>
    <section class="start">
      <el-video-entry
        :title="`Install`"
        :subtitle="`Let’s get you up-and-running in less than 5-minutes.`"
      >
        <template v-slot:left>
          <iframe src="https://www.youtube.com/embed/m0tckSo1KUg" frameborder="0" allowfullscreen />
        </template>

        <template v-slot:right>
          <p>This will create a new site and start a guide that helps you create a starter app.</p>
          <factor-highlight-code>
            <div v-formatted-text="`<code>npx create-factor-app <app-name></code>`" />
          </factor-highlight-code>
        </template>
      </el-video-entry>
    </section>

    <section id="customize">
      <el-video-entry
        :title="`Customize`"
        :subtitle="`Let’s get you up-and-running in less than 5-minutes.`"
      >
        <template v-slot:left>
          <iframe src="https://www.youtube.com/embed/8CwXEsZ0PHU" frameborder="0" allowfullscreen />
        </template>

        <template v-slot:right>
          <p>This will create a new site and start a guide that helps you create a starter app.</p>
          <factor-highlight-code>
            <div v-formatted-text="`<code>npx create-factor-app <app-name></code>`" />
          </factor-highlight-code>
        </template>
      </el-video-entry>
    </section>

    <section id="manage">
      <el-video-entry
        :title="`Manage`"
        :subtitle="`Let’s get you up-and-running in less than 5-minutes.`"
      >
        <template v-slot:left>
          <iframe src="https://www.youtube.com/embed/SHmjfTMrhkM" frameborder="0" allowfullscreen />
        </template>

        <template v-slot:right>
          <p>This will create a new site and start a guide that helps you create a starter app.</p>
          <factor-highlight-code>
            <div v-formatted-text="`<code>npx create-factor-app <app-name></code>`" />
          </factor-highlight-code>
        </template>
      </el-video-entry>
    </section>

    <section id="deploy">
      <el-video-entry
        :title="`Deploy`"
        :subtitle="`Let’s get you up-and-running in less than 5-minutes.`"
      >
        <template v-slot:left>
          <iframe src="https://www.youtube.com/embed/dCtGNqpuDxs" frameborder="0" allowfullscreen />
        </template>

        <template v-slot:right>
          <p>This will create a new site and start a guide that helps you create a starter app.</p>
          <factor-highlight-code>
            <div v-formatted-text="`<code>npx create-factor-app <app-name></code>`" />
          </factor-highlight-code>
        </template>
      </el-video-entry>
    </section>

    <!-- <section class="cta">
      <div class="mast">
        <el-offset-cta
          :title="`Join The Developer Program`"
          :subtitle="`Get chat access, latest updates, support, and more.`"
          :offset="true"
        >
          <factor-link btn="link" size="large" path="/signup">Get Access &rarr;</factor-link>
        </el-offset-cta>
      </div>
    </section>-->

    <!-- <section class="prev-next">
      <div class="mast prev-next-inner">
        <factor-link disabled path="/signup">&larr; Prev</factor-link>
        <factor-link path="/customize">Next &rarr;</factor-link>
      </div>
    </section>-->
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui" //factorIcon
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorHighlightCode,
    factorLink,
    "el-video-entry": () => import("../el/video-entry.vue")
    //"el-offset-cta": () => import("../el/el-cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: "Factor Themes Built and Curated by the Factor Team.",
      description:
        "Factor Themes is a collection of the best templates and themes curated by Factor's creators. Our collection of templates include themes to build a landing page, a static site, an application, and more."
    }
  }
})
</script>
<style lang="less">
.start-container {
  .mast {
    //padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 0 2em;
    }
  }

  .start-nav {
    padding-top: 6em;
    background-color: #ecf4f9;
    .nav {
      a {
        opacity: 0.5;
        color: inherit;
        font-weight: 700;
        text-transform: uppercase;
        padding-right: 1em;
        &.active,
        &:hover {
          opacity: 1;
          color: inherit;
        }
      }
    }
  }
  .start {
    padding-bottom: 6em;
    background-color: #ecf4f9;
  }
  .customize {
    padding: 0 0 3em;
  }
  .deploy {
    padding: 3em 0;
  }

  .cta {
    margin: 0 0 2em;
    button.app-btn.link {
      color: #fff;
      background: rgba(0, 0, 0, 0.1);

      &:hover {
        background: #0c1647; //rgba(0, 0, 0, 0.15);
      }
    }
  }
  .prev-next {
    .prev-next-inner {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      .disabled {
        opacity: 0.5;
      }
    }
  }
}
</style>
