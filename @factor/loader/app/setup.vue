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
          <img src="./img/check.svg" />
        </span>
        <span v-else class="num">{{ index + 1 }}</span>
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
                <router-link class="btn" to="/setup?step=2">Create Your Account &rarr;</router-link>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('app')" key="account" class="page-item account">
          <transition appear>
            <div class="page-item-pad">
              <div class="user-image">
                <div class="user-image-wrap">
                  <img :src="appAvatar" />
                </div>
              </div>
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
                <router-link class="btn" to="/setup?step=3">Next Step &rarr;</router-link>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('account')" key="account" class="page-item account">
          <transition appear>
            <div class="page-item-pad">
              <div class="user-image">
                <div class="user-image-wrap">
                  <img :src="userAvatar" />
                </div>
              </div>
              <div class="header">
                <div class="title">Your Account</div>
                <div class="sub-title">Create an Admin User</div>
              </div>
              <form class="setup-form">
                <div v-for="(input, index) in inputs.account" :key="index" class="input-item">
                  <transition appear>
                    <label v-if="form[input._id]">{{ input.label }}</label>
                  </transition>
                  <input v-model="form[input._id]" :type="input.type" :placeholder="input.label" />
                </div>
              </form>

              <div class="actions">
                <router-link class="btn" to="/setup?step=3">Next Step &rarr;</router-link>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="isStep('theme')" key="theme" class="gallery-item page-item">
          <transition appear>
            <div class="gallery-item-pad page-item-pad">
              <div class="header">
                <div class="title">Select Default Theme</div>
                <div class="sub-title">You can always change this later.</div>
              </div>
              <div class="gallery-item-action">
                <form class="setup-form">
                  <div v-for="(input, index) in inputs.theme" :key="index" class="input-item">
                    <transition appear>
                      <label v-if="form[input._id]">{{ input.label }}</label>
                    </transition>
                    <input v-model="form[input._id]" :type="input.type" :placeholder="input.label" />
                  </div>
                  <div class="actions">
                    <router-link class="btn" to="/setup?step=4">Select Theme &rarr;</router-link>
                    <div class="skipper">
                      or
                      <router-link class="skip" to="/setup?step=4">skip this step</router-link>
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
              <div class="actions add-space">
                <div class="btn" @click="sendData()">Build App &rarr;</div>
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
            label: "Application Title",
            _id: "appName"
          },
          {
            type: "url",
            label: "Production URL",
            _id: "appUrl"
          },
          {
            type: "email",
            label: "Application Email",
            description: "For transactional email",
            _id: "appEmail"
          }
        ],
        account: [
          {
            type: "text",
            label: "Full Name",
            _id: "displayName"
          },
          {
            type: "email",
            label: "Email",
            _id: "email"
          },
          {
            type: "password",
            label: "Password",
            _id: "password"
          }
        ],
        theme: [{ type: "text", label: "Theme Package", _id: "theme" }]
      },
      steps: [
        {
          _id: "welcome",
          complete: () => {
            return this.step > 1 ? true : false
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
            return this.form.theme ? true : false
          }
        },
        {
          _id: "done",
          complete: () => {
            return this.isComplete("account") && this.isComplete("theme") ? true : false
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
      return gravatar.url(this.form.appEmail, { s: "200", d: "retro" }) || ""
    }
  },
  methods: {
    getStep(_id) {
      const index = this.steps.findIndex(_ => _id == _._id)
      return index + 1
    },
    isStep(_id) {
      return this.getStep(_id) == this.step ? true : false
    },
    setTheme(theme) {
      this.$set(this.form, "theme", theme)
    },
    sendData() {
      sendEvent({ installed: true, data: this.form })

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
    padding: 1rem;
    .pg {
      user-select: none;
      text-decoration: none;
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      .check {
        line-height: 2.5;
        img {
          width: 1.1em;
        }
      }
      text-align: center;
      border-radius: 8px;

      color: var(--color-text-subtle);
      border: 1px solid var(--color-text-subtle);
      font-weight: 700;
      font-size: 1.2em;
      margin: 0.5rem;

      transition: opacity 0.2s;
      &.active,
      &:hover {
        background: var(--color-text-subtle);
        opacity: 1;
        color: #fff;
      }
      &.complete {
        border: 1px solid var(--color-text-subtle);
        background: var(--color-text-subtle);
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
      padding: 3rem;
      border-radius: 10px;
      background: #fff;
      box-shadow: var(--panel-shadow);
      .setup-image {
        text-align: center;
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

  .page-item {
    width: 650px;
    max-width: 95vw;
    margin: 0 1rem;
    .page-item-pad {
      padding: 3rem;
      border-radius: 10px;
      background: #fff;
      box-shadow: var(--panel-shadow);
      .setup-image {
        text-align: center;
      }
      .user-image {
        text-align: center;

        margin-bottom: 1rem;
        img {
          width: 80px;
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
  .header {
    text-align: center;

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
    &.add-space {
      margin-top: 2rem;
    }
    .skipper {
      display: block;
      margin-top: 1rem;
      opacity: 0.4;
      .skip {
        color: inherit;
      }
    }
  }
}
</style>
