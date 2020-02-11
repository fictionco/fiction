<template>
  <div class="signin" data-test="signin">
    <div class="signin-header">
      <div class="title">{{ header.title }}</div>
      <div v-if="header.subTitle" class="sub-title">{{ header.subTitle }}</div>

      <template v-if="!isLoggedIn()">
        <div v-if="newAccount && !view" class="forgot-password alternative-action-link">
          Have an account?
          <a
            href="#"
            data-test="link-login"
            @click.prevent="newAccount = false"
          >Login &rarr;</a>
        </div>

        <div v-else-if="!view" class="new-account alternative-action-link">
          Don't have an account?
          <a
            href="#"
            data-test="link-register"
            @click.prevent="newAccount = true"
          >Sign Up &rarr;</a>
        </div>
      </template>
    </div>
    <factor-form ref="signin-form">
      <template v-if="view == 'forgot-password'">
        <dashboard-input
          v-model="form.email"
          data-test="input-password-email"
          input="factor-input-email"
          required
          placeholder="Email"
          @keyup.enter="trigger('forgot-password')"
        />
        <factor-btn
          ref="forgot-password"
          :loading="loading"
          btn="primary"
          data-test="send-password-email"
          text="Send Password Reset Email"
          @click="send({ action: sendPasswordResetEmail, next: `password-email-sent` })"
        />
      </template>

      <template v-else-if="view == 'reset-password'">
        <dashboard-input
          v-model="form.password"
          input="factor-input-password"
          data-test="reset-password"
          autocomplete="new-password"
          required
          placeholder="Password"
          @keyup.enter="trigger('reset-password')"
        />
        <factor-btn
          ref="reset-password"
          btn="primary"
          :loading="loading"
          text="Reset Password"
          @click="
            send({ action: verifyAndResetPassword, next: `successful-password-reset` })
          "
        />
      </template>

      <template v-else-if="!view && isLoggedIn()">
        <div class="action">
          <factor-link btn="primary" text="Account Settings" path="/dashboard/account" />
        </div>
      </template>

      <template v-else-if="!view">
        <dashboard-input
          v-if="newAccount"
          v-model="form.displayName"
          input="factor-input-text"
          data-test="signin-name"
          required
          placeholder="Full Name"
          @keyup.enter="trigger('submit')"
        />
        <dashboard-input
          v-model="form.email"
          input="factor-input-email"
          data-test="signin-email"
          required
          placeholder="Email"
          @keyup.enter="trigger('submit')"
        />
        <dashboard-input
          v-model="form.password"
          input="factor-input-password"
          data-test="signin-password"
          :autocomplete="newAccount ? `new-password` : `current-password`"
          required
          placeholder="Password"
          @keyup.enter="trigger('submit')"
        />

        <div class="action">
          <factor-btn
            ref="submit"
            data-test="submit-login"
            :loading="loading"
            btn="primary"
            @click="signIn('email')"
          >{{ newAccount ? 'Sign Up' : 'Login' }} &rarr;</factor-btn>
        </div>
      </template>
    </factor-form>

    <div class="alt-links">
      <template v-if="!isLoggedIn()">
        <template v-if="view">
          <div class="alternative-action-link">
            <a data-test="link-back" @click.prevent="setView()">&larr; Back to Sign In</a>
          </div>
        </template>
        <template v-else>
          <div class="forgot-password alternative-action-link">
            Did you
            <a
              data-test="link-forgot-password"
              @click.prevent="setView(`forgot-password`)"
            >forget your password?</a>
          </div>
        </template>
      </template>
      <div v-else-if="!view" class="forgot-password alternative-action-link">
        Sign in to another account?
        <a @click="logout()">logout&nbsp;&rarr;</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { logout } from "@factor/user/util"
import { dashboardInput } from "@factor/dashboard"
import { factorForm, factorBtn, factorLink } from "@factor/ui"
import { authenticate, userInitialized, isLoggedIn } from "@factor/user"
import {
  sendPasswordResetEmail,
  verifyAndResetPassword
} from "@factor/user/email-request"
import { emitEvent, waitFor } from "@factor/api"
import Vue from "vue"
import { CurrentUserState } from "@factor/user/types"
import { notifySignedIn } from "."
export default Vue.extend({
  components: { factorForm, factorBtn, dashboardInput, factorLink },
  props: {
    format: { type: String, default: "page" },
    redirect: { type: String, default: "" },
    initialView: { type: String, default: "" }
  },
  data() {
    return {
      loading: false,
      form: {},
      newAccount: false,
      user: undefined
    }
  },
  computed: {
    header(this: any) {
      if (this.view == "account-created") {
        return {
          title: "Account Created",
          subTitle: "Good work. Please check your email to confirm your email address."
        }
      } else if (this.view == "password-email-sent") {
        return {
          title: "Reset Email Sent",
          subTitle: "Check your inbox for instructions on recovering your password."
        }
      } else if (this.view == "successful-password-reset") {
        return {
          title: "Password Changed",
          subTitle: "You've successfully changed your password."
        }
      } else if (this.view == "forgot-password") {
        return {
          title: "Password Reset",
          subTitle: "Enter your account email address."
        }
      } else if (this.view == "reset-password") {
        return {
          title: "Enter New Password",
          subTitle: "Enter your new password."
        }
      } else if (isLoggedIn()) {
        return {
          title: "You are signed in"
        }
      } else if (this.newAccount) {
        return {
          title: "Sign Up"
        }
      } else {
        return {
          title: "Login"
        }
      }
    },
    view(this: any) {
      return this.$route.query.view || ""
    },
    mode(this: any) {
      return this.$route.query.mode || "continue"
    },
    redirectPath(this: any) {
      const defaultRedirect = this.$route.name == "signin" ? "/" : false
      return this.redirect ? this.redirect : this.$route.query.redirect || defaultRedirect
    }
  },
  created(this: any) {
    const { email, displayName, newAccount } = this.$route.query

    if (email) {
      this.$set(this.form, "email", email)
    }
    if (displayName) {
      this.$set(this.form, "displayName", displayName)
    }

    if (typeof newAccount !== "undefined") {
      this.newAccount = true
    }

    if (this.initialView) {
      this.setView(this.initialView)
    }
  },
  methods: {
    sendPasswordResetEmail,
    verifyAndResetPassword,
    isLoggedIn,
    logout,
    trigger(this: any, ref: string) {
      this.$refs[ref].$el.focus()
      this.$refs[ref].$el.click()
    },
    async send(this: any, { action, next }: { action: Function; next: string }) {
      const r = this.$refs["signin-form"].$el.reportValidity()

      if (!r) return

      this.loading = true

      const args = { ...this.form, ...this.$route.query }

      try {
        await action(args)
        this.setView(next)
      } catch (error) {
        this.loading = false
      }

      this.loading = false
    },

    async signIn(this: any) {
      this.errors = []

      const r = this.$refs["signin-form"].$el.reportValidity()

      if (!r) return

      this.loading = true
      let user
      try {
        user = await authenticate({ ...this.form, newAccount: this.newAccount })
      } catch (error) {
        this.loading = false
      }

      if (user) {
        this.user = user
        this.success(user)
      }

      this.loading = false
    },

    /**
     * Set to null to remove from query
     */
    setView(this: any, view?: string | null) {
      const query = { ...this.$route.query, view }

      if (!view) {
        delete query.view
      }

      if (query != this.$route.query) {
        this.$router.replace({ query })
      }
    },

    done(this: any) {
      this.$emit("done")
      if (this.format != "modal") {
        this.setView()
      }
    },

    notifySignedIn(this: any) {
      /**
       * If inside a modal then the modal handles notification
       * Because it needs to track close events
       */
      if (this.format != "modal") {
        notifySignedIn()
      }
    },

    success(this: any) {
      const newAccount = this.newAccount

      if (this.redirectPath) {
        userInitialized(async (user: CurrentUserState) => {
          if (user && user._id && this.redirectPath) {
            await this.$router.push({ path: this.redirectPath })

            waitFor(1000)

            if (newAccount) {
              emitEvent("sign-in-modal", { view: "account-created", user })
            }
          }
        })
      } else {
        this.notifySignedIn()
        if (newAccount) {
          this.setView("account-created")
        } else {
          this.done()
        }
      }
    }
  }
})
</script>

<style lang="less">
.signin {
  margin: 1em auto 1em;
  width: 300px;
  text-align: center;
  form {
    font-size: 1.2em;
    input {
      width: 100%;
      max-width: 350px;
    }
  }
  .signin-header {
    margin-bottom: 1.5em;
    .title {
      font-size: 1.8em;
      letter-spacing: -0.02em;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 0.5rem;
    }
    .sub-title {
      font-weight: 500;
      opacity: 0.7;
    }
  }
  .alt-links {
    margin-top: 2em;
    text-align: center;
    font-weight: 500;

    line-height: 1.8;
    a {
      cursor: pointer;
      color: var(--color-primary);
      &:hover {
        color: var(--color-secondary);
      }
    }
  }

  .sep {
    position: relative;
    margin: 1em 0;
    text-align: center;

    font-style: italic;
    .text {
      opacity: 0.4;
      padding: 0 1em;
      //  background: #fff;
      z-index: 10;
      position: relative;
    }
  }
  .action {
    margin-top: 1em;
  }

  .image-organizer {
    justify-content: center;
  }
}
</style>
