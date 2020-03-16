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
        <div v-if="step == 1" key="welcome" class="page-item">
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
        <div v-else-if="step == 2" key="account" class="page-item account">
          <transition appear>
            <div class="page-item-pad">
              <div class="user-image">
                <div class="user-image-wrap">
                  <img :src="avatarUrl" />
                </div>
              </div>
              <div class="header">
                <div class="title">Your Account</div>
                <div class="sub-title">Create an Admin User</div>
              </div>
              <form class="setup-form">
                <div class="input-item">
                  <label>Site Title</label>
                  <input v-model="form.siteTitle" type="text" />
                </div>
                <div class="input-item">
                  <label>Full Name</label>
                  <input v-model="form.displayName" type="text" />
                </div>
                <div class="input-item">
                  <label>Email</label>
                  <input v-model="form.email" type="email" />
                </div>
                <div class="input-item">
                  <label>Password</label>
                  <input v-model="form.password" type="password" />
                </div>
              </form>

              <div class="actions">
                <router-link class="btn" to="/setup?step=3">Create Account &rarr;</router-link>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="step == 3" key="done" class="gallery-item">
          <transition appear>
            <div class="gallery-item-pad">
              <div class="header">
                <div class="title">Select Default Theme</div>
                <div class="sub-title">You can always change this later.</div>
              </div>
              <div class="actions">
                <div class="btn" disabled @click="sendData()">Select Theme &rarr;</div>
              </div>
              <div class="theme-gallery-wrap">
                <div class="theme-gallery">
                  <div v-for="page in 10" :key="page" class="theme">
                    <img src="./img/theme-zeno.jpg" alt="Zeno" />
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="step == 4" key="done" class="page-item">
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
              <div class="actions">
                <div class="btn" @click="sendData()">Build App &rarr;</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
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
  mixins: [capitalizeMixin, logMixin, sseMixin, storageMixin],

  data() {
    return {
      baseURL: window.$BASE_URL,
      form: {},
      steps: [
        {
          _id: "welcome",
          complete: () => {
            return this.step > 1 ? true : false
          }
        },
        {
          _id: "account",
          complete: () => {
            return this.form.siteTitle &&
              this.form.displayName &&
              this.form.password &&
              this.form.email
              ? true
              : false
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
    avatarUrl() {
      return gravatar.url(this.form.email, { s: "200", d: "retro" }) || ""
    }
  },
  methods: {
    sendData() {
      sendEvent({ installed: true, test: "works" })

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
  background: var(--color-bg-contrast);
  --panel-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
  .setup-content {
    display: flex;
    justify-content: center;
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

      color: #fff;
      font-weight: 700;
      font-size: 1.2em;
      margin: 0.5rem;
      opacity: 0.4;
      background: var(--color-text);
      transition: opacity 0.2s;
      &.active,
      &:hover {
        opacity: 1;
        background: var(--color-text);
        color: #fff;
      }
      &.complete {
        background: var(--color-primary);
      }
    }
  }
  .gallery-item {
    .header {
      margin-top: 2rem;
    }
    .actions {
      margin: 2em 0 3rem;
    }
  }
  .theme-gallery-wrap {
  }
  .theme-gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
    .theme {
      width: 300px;

      img {
        box-shadow: var(--panel-shadow);
        border-radius: 5px;
        width: 100%;
      }
    }
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
    .header {
      margin-top: 2rem;
    }
    .actions {
      margin: 2em 0 3rem;
    }
  }
  .theme-gallery-wrap {
  }
  .theme-gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
    .theme {
      width: 300px;

      img {
        box-shadow: var(--panel-shadow);
        border-radius: 5px;
        width: 100%;
      }
    }
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
    margin: 0 0 3rem;
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

  .hero {
    width: 140%;
    margin-left: -20%;
    img {
      max-width: 100%;
    }
  }
  .setup-form {
    max-width: 380px;
    padding: 1rem 2rem;
    margin: 0 auto;
    .input-item {
      margin: 1rem 0;
      input {
        font-size: 1.3rem;
      }
    }
    label {
      display: block;
      font-weight: 600;

      margin-bottom: 0.5rem;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
  }
}
</style>
