<template>
  <div class="setup">
    <div class="pages">
      <router-link
        v-for="(page, index) in steps"
        :key="index"
        :to="`/setup?step=${index + 1}`"
        class="pg"
        :class="[step == index + 1 ? 'active' : '', isComplete(page._id) ? 'complete' : '']"
      >
        <span v-if="isComplete(page._id)" class="check">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
          </svg>
        </span>
        <span class="num">{{ page._id }}</span>
      </router-link>
    </div>
    <div class="setup-content">
      <div class="setup-page-items">
        <div v-if="isStep('welcome')" key="welcome" class="page-item">
          <transition appear>
            <div class="page-item-pad">
              <div class="header">
                <div class="title">Welcome to Factor</div>
                <div class="sub-title">Good work so far. Let's get you setup.</div>
              </div>
              <div class="hero-wrap">
                <div class="hero">
                  <img src="./img/factor-flying-icons.svg" alt="Factor Screenshot" />
                </div>
              </div>
              <div class="actions">
                <div class="btn primary next-step" @click="nextStep()">Start &rarr;</div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('app')" key="account" class="page-item account">
          <transition appear>
            <div class="page-item-pad">
              <transition appear>
                <div v-if="form.appEmail" class="user-image">
                  <a class="user-image-wrap" target="_blank" href="https://gravatar.com">
                    <img :src="appAvatar" title="gravatar" alt="gravatar" />
                  </a>
                </div>
              </transition>
              <div class="header">
                <div class="title">Your App</div>
                <div class="sub-title">You can change this later.</div>
              </div>
              <form class="setup-form">
                <form-input
                  v-for="(input, index) in inputs.app"
                  :key="index"
                  v-model="form[input._id]"
                  :input="input"
                />
              </form>

              <div class="actions">
                <div
                  class="btn next-step"
                  :class="isComplete('app') ? 'primary': 'default'"
                  @click="nextStep()"
                >Next Step &rarr;</div>
                <div class="skipper">
                  or
                  <span class="skip-step" @click="skip.app = true;nextStep()">skip this step</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('account')" key="account" class="page-item account">
          <transition appear>
            <div class="page-item-pad">
              <transition appear>
                <div v-if="form.email" class="user-image">
                  <a class="user-image-wrap" target="_blank" href="https://gravatar.com">
                    <img :src="userAvatar" title="gravatar" alt="gravatar" />
                  </a>
                </div>
              </transition>
              <div class="header">
                <div class="title">Your Account</div>
                <div class="sub-title">Create an Admin User</div>
              </div>
              <form class="setup-form">
                <form-input
                  v-for="(input, index) in inputs.account"
                  :key="index"
                  v-model="form[input._id]"
                  :input="input"
                />
              </form>

              <div class="actions">
                <div
                  class="btn next-step"
                  :class="isComplete('account') ? 'primary': 'default'"
                  @click="nextStep()"
                >Next Step &rarr;</div>
                <div class="skipper">
                  or
                  <span class="skip-step" @click="skip.account = true;nextStep()">skip this step</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('theme')" key="theme" class="gallery-item page-item">
          <transition appear>
            <div class="gallery-item-pad page-item-pad">
              <div class="header">
                <div class="title">Select Default Theme</div>
                <div class="sub-title">You can change this later.</div>
              </div>
              <div class="gallery-item-action">
                <form class="setup-form">
                  <form-input
                    v-for="(input, index) in inputs.theme"
                    :key="index"
                    v-model="form[input._id]"
                    :input="input"
                  />
                  <div class="actions">
                    <div
                      class="btn primary primary next-step"
                      :class="isComplete('theme') ? 'primary': 'default'"
                      @click="nextStep()"
                    >Next Step &rarr;</div>
                    <div class="skipper">
                      or
                      <span
                        class="skip-step"
                        @click="form.theme = ''; skip.theme = true;nextStep()"
                      >skip this step</span>
                    </div>
                  </div>
                </form>
              </div>
              <div class="theme-gallery-wrap">
                <div class="theme-gallery">
                  <div
                    v-for="(theme, index) in themes"
                    :key="index"
                    class="theme"
                    :class="form.theme == theme.value ? 'selected': ''"
                    @click="setTheme(theme.value)"
                  >
                    <img :src="theme.screenshot" :alt="`Screenshot ${theme.name}`" />
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('db')" key="db" class="page-item db">
          <transition appear>
            <div class="page-item-pad">
              <div class="setup-image">
                <img src="./img/mongodb.svg" alt="Mongo" />
              </div>
              <div class="header">
                <div class="title">Database Connection</div>
                <div class="sub-title">
                  A MongoDB URL.
                  <br />Handles all dynamic data.
                  <br />
                  <a
                    class="addendum"
                    href="https://docs.mongodb.com/manual/reference/connection-string/"
                    target="_blank"
                  >MongoDB Docs</a>
                  <a
                    class="addendum"
                    href="https://youtu.be/KKyag6t98g8?t=90"
                    target="_blank"
                  >Video Tutorial</a>
                </div>
              </div>
              <form class="setup-form">
                <form-input
                  v-for="(input, index) in inputs.db"
                  :key="index"
                  v-model="form[input._id]"
                  :input="input"
                />
              </form>

              <div class="actions">
                <div
                  class="btn next-step"
                  :class="isComplete('db') ? 'primary': 'default'"
                  @click="nextStep()"
                >Next Step &rarr;</div>

                <div class="skipper">
                  or
                  <span
                    class="skip-step"
                    @click="skip.app = true;nextStep()"
                  >skip and use the demo db</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('done')" key="done" class="page-item">
          <transition appear>
            <div class="page-item-pad">
              <div class="setup-image">
                <img src="./img/popper.svg" alt="Complete" />
              </div>
              <div class="header">
                <div class="title">Your Setup is Complete</div>
                <div
                  class="sub-title"
                >You can now customize your app and modify other settings on your dashboard.</div>
              </div>
              <div class="actions top-margin">
                <div class="btn primary" @click="sendData()">Save Config &amp; Build App &rarr;</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="footer">
      <transition appear>
        <factor-logo />
      </transition>
    </div>
  </div>
</template>
<script >
import Vue from "vue"

import gravatar from "gravatar"
import { dotSetting } from "@factor/api/utils"
import capitalizeMixin from "./mixins/capitalize"
import logMixin from "./mixins/log"
import sseMixin from "./mixins/sse"
import storageMixin from "./mixins/storage"
import { sendEvent } from "./utils"
export default Vue.extend({
  components: {
    factorLogo: () => import("./logo-factor.vue"),
    formInput: () => import("./el/form-input.vue")
  },
  mixins: [capitalizeMixin, logMixin, sseMixin, storageMixin],
  data() {
    return {
      skip: {},
      baseURL: window.$BASE_URL,
      form: {},
      themes: [
        {
          name: "Zeno",
          screenshot: require("./img/screenshot-zeno.jpg"),
          value: "@factor/theme-zeno"
        },
        {
          name: "Ultra",
          screenshot: require("./img/screenshot-ultra.jpg"),
          value: "@factor/theme-ultra"
        },
        {
          name: "Alpha",
          screenshot: require("./img/screenshot-alpha.jpg"),
          value: "@factor/theme-alpha"
        }
      ],
      inputs: {
        app: [
          {
            type: "text",
            label: "App Title",
            placeholder: "Example App",
            _id: "appName",
            setting: "app.name"
          },
          {
            type: "text",
            label: "App Description",
            placeholder: "An example app",
            _id: "appDescription",
            setting: "app.description"
          },
          {
            type: "url",
            label: "URL in Production",
            placeholder: "https://www.example.com",
            description: "Needed for transactional email",
            _id: "appUrl",
            setting: "app.url"
          },
          {
            type: "email",
            label: `Transaction Email Address`,
            placeholder: "team@example.com",
            description: "Needed for transactional email",
            _id: "appEmail",
            setting: "app.email"
          }
        ],
        account: [
          {
            type: "text",
            label: "Full Name",
            placeholder: "",
            _id: "displayName"
          },
          {
            type: "email",
            label: "Email",
            placeholder: "email@example.com",
            _id: "email"
          },
          {
            type: "password",
            label: "Password",
            placeholder: "",
            _id: "password"
          }
        ],
        theme: [{ type: "text", label: "Theme Package", _id: "theme" }],
        db: [
          {
            type: "url",
            label: "Db Connection",
            _id: "db",
            placeholder:
              "mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"
          }
        ]
      },
      steps: [
        {
          _id: "welcome",
          complete: () => {
            return this.step >= 1 ? true : false
          }
        },
        {
          _id: "app",
          complete: () => {
            return !!(this.form.appName && this.form.appUrl && this.form.appEmail)
          }
        },
        {
          _id: "account",
          complete: () => {
            return !!(this.form.displayName && this.form.password && this.form.email)
          }
        },
        {
          _id: "theme",
          complete: () => {
            return this.form.theme || this.step > this.getStepIndex("theme")
              ? true
              : false
          }
        },
        // {
        //   _id: "db",
        //   complete: () => {
        //     return this.step > this.getStepIndex("db") ? true : false
        //   }
        // },
        {
          _id: "done",
          complete: () => {
            return this.isStep("done") ? true : false
          }
        }
      ],
      completed: {}
    }
  },
  computed: {
    step() {
      return this.$route.query.step ?? 1
    },
    userAvatar() {
      return gravatar.url(this.form.email, { s: "200", d: "retro" }) || ""
    },
    appAvatar() {
      return gravatar.url(this.form.appEmail, { s: "200", d: "identicon" }) || ""
    },
    settings() {
      return window.$STATE.settings || {}
    }
  },
  mounted() {
    document.title = "Factor Setup"
    /**
     * Set initial form values if they already exist in config
     */
    Object.values(this.inputs).forEach(inputSet => {
      inputSet.forEach(input => {
        if (input.setting) {
          const val = this.getValue(input.setting)
          if (val) {
            this.$set(this.form, input._id, val)
          }
        }
      })
    })
  },
  methods: {
    getValue(key) {
      if (!key) return

      return dotSetting({ key, settings: this.settings })
    },
    nextStep() {
      this.$router.push({ path: "/setup", query: { step: Number(this.step) + 1 } })
    },
    getStep(_id) {
      return this.steps.find(_ => _id == _._id)
    },
    getStepIndex(_id) {
      const index = this.steps.findIndex(_ => _id == _._id)
      return index + 1
    },
    isStep(_id) {
      return this.getStepIndex(_id) == this.step ? true : false
    },
    setTheme(theme) {
      this.$set(this.form, "theme", theme)
    },
    sendData() {
      sendEvent({ installed: true, form: this.form })

      this.$router.push({ path: "/" })
    },
    isComplete(id) {
      const step = this.steps.find(step => step._id == id)

      if (step && step.complete && step.complete()) {
        return true
      } else {
        return false
      }
    }
  }
})
</script>


<style lang="less">
.setup {
  min-height: 100vh;
  --color-text-subtle: #98a5b9;
  background: var(--color-bg-contrast);
  --panel-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
  .setup-content {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .footer {
    display: flex;
    justify-content: center;
    padding: 1rem 0 3rem;
    width: 100%;
  }
  .pages {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 1rem;
    .pg {
      user-select: none;
      text-decoration: none;
      line-height: 1;
      padding: 0.23rem 1rem 0.2rem;

      display: flex;
      align-items: center;
      .check {
        svg {
          width: 1.1em;
          path {
            fill: var(--color-primary);
          }
        }
        margin-right: 0.5rem;
      }
      text-align: center;
      border-radius: 8px;
      background: #fff;
      color: var(--color-text);
      border: 1px solid var(--color-text-subtle);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.8em;
      .num {
        line-height: 1.8;
      }
      margin: 0.5rem;

      transition: opacity 0.2s;
      &.active,
      &:hover {
        color: #fff;
        border: 1px solid var(--color-primary);
        background: var(--color-primary);
        .check svg path {
          fill: #fff;
        }
      }
    }
  }

  .page-item {
    width: 650px;
    max-width: 95vw;
    margin: 1rem;

    &.gallery-item {
      width: 1000px;

      .actions {
        margin: 2em 0 0;
      }
      .theme-gallery {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2rem;
        .theme {
          img {
            box-shadow: var(--panel-shadow);
            border-radius: 5px;
            width: 100%;
          }
          &:hover img {
            box-shadow: 0 0 0 5px var(--color-text);
          }
          &.selected img {
            box-shadow: 0 0 0 5px var(--color-primary);
          }
        }
      }
    }
    .page-item-pad {
      padding: 3rem 3rem 5rem;
      border-radius: 10px;
      background: #fff;
      box-shadow: var(--panel-shadow);
      @media (max-width: 900px) {
        padding: 1rem 1rem 3rem;
      }
      .setup-image {
        text-align: center;
        img {
          min-width: 50px;
        }
        margin-bottom: 2rem;
      }
      .user-image {
        text-align: center;

        margin-bottom: 1rem;
        img {
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 50%;
          display: inline-block;
        }
      }
    }
    &.account {
      .header {
        margin-bottom: 0;
      }
    }
  }
  .gallery-item {
  }

  // .page-item {
  //   width: 650px;
  //   max-width: 95vw;
  //   margin: 0 1rem;
  //   .page-item-pad {
  //     padding: 3rem;
  //     border-radius: 10px;
  //     background: #fff;
  //     box-shadow: var(--panel-shadow);
  //     .setup-image {
  //       text-align: center;
  //     }
  //     .user-image {
  //       text-align: center;

  //       margin-bottom: 1rem;
  //       img {
  //         width: 80px;
  //         background: #fff;
  //         border-radius: 50%;
  //         display: inline-block;
  //       }
  //     }
  //   }
  //   &.account {
  //     .header {
  //       margin-bottom: 0;
  //     }
  //   }
  // }
  .header {
    text-align: center;
    a {
      color: inherit;
    }
    .title {
      letter-spacing: -0.02em;
      font-weight: 700;
      font-size: 2.2em;
      margin-bottom: 1rem;
    }
    .sub-title {
      opacity: 0.7;
      font-size: 1.35em;
      line-height: 1.6;
    }
    .addendum {
      font-size: 0.8em;
      margin: 0 0.5rem;
      color: var(--color-primary);
      text-decoration: none;
    }
  }

  .hero-wrap {
    margin-top: 3rem;
    .hero {
      width: 140%;
      margin-left: -20%;
      img {
        max-width: 100%;
      }
    }
  }

  .setup-form {
    max-width: 380px;
    padding: 1rem 2rem;
    margin: 0 auto;
  }

  .actions {
    text-align: center;
    &.top-margin {
      margin-top: 2rem;
    }
    .back-step,
    .next-step,
    .skip-step {
      cursor: pointer;
    }

    .skipper {
      display: block;
      margin-top: 1rem;
      opacity: 0.4;
      .skip-step {
        text-decoration: underline;
      }
    }
  }
}
</style>
