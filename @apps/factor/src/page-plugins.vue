<template>
  <div class="plugins-container">
    <section class="mast">
      <div class="splash">
        <div>
          <h1 class="title">Factor Plugins</h1>
          <p class="subtitle">Extend your project features and do more with Factor.</p>
        </div>
      </div>
    </section>
    <section class="plugins-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast plugins">
        <h2 class="soon">Coming Soon</h2>
        <div class="sidebar">
          <h3 class="title">Categories</h3>
          <ul class="list-categories">
            <li>
              <factor-link path="/plugins">All</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/monitoring">Monitoring</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/payment">Payment</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/emailing">Emailing</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/search">Search</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/admin">Admin</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/security">Security</factor-link>
            </li>
            <li>
              <factor-link path="/plugins/maps">Maps</factor-link>
            </li>
          </ul>
        </div>
        <div class="content">
          <div class="search-bar">
            <form>
              <span>
                <factor-icon icon="search" />
              </span>
              <input type="text" name="search" placeholder="Search Plugins" />
            </form>
          </div>

          <div class="items-wrap">
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/paypal.jpg`)" alt="Paypal" />
                <div>
                  <h3 class="title">Paypal</h3>
                  <span class="category">Payment</span>
                </div>
              </div>
              <p>Integrate the PayPal Checkout &amp; Subscriptions API</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/algolia.jpg`)" alt="Algolia" />
                <div>
                  <h3 class="title">Algolia</h3>
                  <span class="category">Search</span>
                </div>
              </div>
              <p>Enable blazing fast search for your project.</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/paypal.jpg`)" alt="Paypal" />
                <div>
                  <h3 class="title">Paypal</h3>
                  <span class="category">Search</span>
                </div>
              </div>
              <p>Integrate the PayPal Checkout &amp; Subscriptions API</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/paypal.jpg`)" alt="Paypal" />
                <div>
                  <h3 class="title">Paypal</h3>
                  <span class="category">Search</span>
                </div>
              </div>
              <p>Integrate the PayPal Checkout &amp; Subscriptions API</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/paypal.jpg`)" alt="Paypal" />
                <div>
                  <h3 class="title">Paypal</h3>
                  <span class="category">Search</span>
                </div>
              </div>
              <p>Integrate the PayPal Checkout &amp; Subscriptions API</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
            <a href="#" class="item">
              <div class="item-top">
                <img :src="require(`./img/paypal.jpg`)" alt="Paypal" />
                <div>
                  <h3 class="title">Paypal</h3>
                  <span class="category">Search</span>
                </div>
              </div>
              <p>Integrate the PayPal Checkout &amp; Subscriptions API</p>
              <p class="downloads"><i class="fa fa-download" /> 254 Downloads</p>
              <p class="author"><i class="fa fa-user" /> by Fiction</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { factorIcon, factorLink } from "@factor/ui"
import { toLabel } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon, factorLink },
  data() {
    return {
      loading: true,
      nav: [],
      headers: [],
      allHeaders: [],
      clicked: false
    }
  },
  computed: {
    pluginsPage() {
      return this.$route.params.doc || "introduction"
    },
    normalizedNav() {
      return this.navItems().map(_ => {
        if (typeof _ == "string") {
          return {
            slug: _,
            name: toLabel(_)
          }
        } else {
          return _
        }
      })
    },
    activePath() {
      return this.$route.params.doc || ""
    }
  },

  methods: {
    navItems() {
      const nav = [
        {
          name: "All",
          slug: ""
        },
        "monitoring",
        "payment",
        "emailing",
        "search",
        "admin",
        "security",
        "maps"
      ]

      return nav
    }
  },
  metaInfo() {
    return {
      title: "Factor Plugins",
      meta: [
        {
          name: "description",
          content: "Extend your project features and do more with Factor."
        }
      ]
    }
  }
})
</script>
<style lang="less">
.plugins-container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .stripes-wrap {
    position: relative;
    .stripes {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      top: 0;
      transform: skewY(-5deg);
      background: #fafbff;
    }
    .mast {
      position: relative;
    }
  }
  .splash {
    padding: 10em 0 7em 0;
    text-align: center;

    .title {
      font-weight: 600;
      font-size: 2em;
      letter-spacing: -0.03em;
      line-height: 0.9;
      margin-bottom: 0.2em;
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.3em;
      font-weight: 500;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .actions {
      margin-top: 1.5em;
      @media (max-width: 767px) {
        margin-bottom: 1.5em;
      }
    }
  }
  .plugins-wrap {
    padding: 6em 0;
    margin: 0 0 4em;
    .plugins {
      display: grid;
      grid-template-columns: 1fr 5fr;
      grid-column-gap: 2em;
      position: relative;
      .soon {
        display: flex;
        justify-content: center;

        position: absolute;
        z-index: 5;
        font-weight: 600;
        font-size: 2em;
        text-align: center;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        opacity: 1;
        width: 100%;
        height: 100%;
        background: rgba(250, 251, 255, 0.9);
      }
      @media (max-width: 767px) {
        display: block;
      }
    }
  }

  .sidebar {
    .title {
      font-size: 1.4em;
      font-weight: 800;
    }
    .list-categories {
      list-style: none;
      padding: 0;
      margin-top: 1em;
      font-size: 1.2em;
      li {
        margin-bottom: 10px;
        a {
          color: rgba(80, 102, 119, 0.5);
          &:hover {
            color: rgba(80, 102, 119, 1);
          }
          &.router-link-exact-active {
            color: #0496ff;
            font-weight: 800;
          }
        }
      }
    }
  }
  .search-bar {
    background: #fff;
    padding: 5px 15px;
    border: 1px solid #eaeced;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-bottom: 2em;
    form {
      position: relative;
      span {
        position: absolute;
        top: 10px;
        left: 0;
      }
      span i {
        font-size: 1.2em;
      }
      input {
        outline: 0;
        padding-left: 30px;
        font-size: 1.2em;
        width: calc(100% - 40px);
      }
    }
  }
  .items-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 1em;
    @media (max-width: 767px) {
      display: block;
    }
    .item {
      display: block;
      color: inherit;
      padding: 1em;
      margin-bottom: 1.5em;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease-in-out;
      &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08),
          0 11px 16px rgba(50, 50, 93, 0.2);
      }
      .item-top {
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        margin-bottom: 15px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .title {
          color: #0496ff;
        }
      }
      .downloads,
      .author {
        margin-top: 0.7em;
        opacity: 0.7;
        font-size: 0.9em;
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
