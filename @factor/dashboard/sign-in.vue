<template>
  <div class="signin" data-test="signin">
    <div class="signin-header">
      <div class="title">{{ header.title }}</div>
      <div class="sub-title">{{ header.subTitle }}</div>
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
          <factor-link btn="primary" text="Account" path="/dashboard/account" />
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
            :text="newAccount ? 'Sign Up' : 'Login'"
            @click="signIn('email')"
          />
        </div>
      </template>
    </factor-form>

    <div class="alt-links">
      <template v-if="newAccount">
        <div class="forgot-password alternative-action-link">
          Have an account?
          <a
            href="#"
            data-test="link-login"
            @click.prevent="newAccount = false"
          >Login</a>
        </div>
      </template>
      <template v-else-if="view">
        <div class="alternative-action-link">
          <a
            href="#"
            data-test="link-back"
            @click.prevent="setView(undefined)"
          >&larr; Back to Sign In</a>
        </div>
      </template>
      <template v-else>
        <div class="new-account alternative-action-link">
          Don't have an account?
          <a
            href="#"
            data-test="link-register"
            @click.prevent="newAccount = true"
          >Sign Up</a>
        </div>
        <div class="forgot-password alternative-action-link">
          Did you
          <a
            href="#"
            data-test="link-forgot-password"
            @click.prevent="setView(`forgot-password`)"
          >forget your password?</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { dashboardInput } from "@factor/dashboard"
import { factorForm, factorBtn, factorLink } from "@factor/ui"
import { authenticate, userInitialized, isLoggedIn } from "@factor/user"
import {
  sendPasswordResetEmail,
  verifyAndResetPassword
} from "@factor/user/email-request"
import { emitEvent } from "@factor/api"
import Vue from "vue"
import { CurrentUserState } from "@factor/user/types"
export default Vue.extend({
  components: { factorForm, factorBtn, dashboardInput, factorLink },
  props: {
    redirect: { type: String, default: "" }
  },
  data() {
    return {
      loading: false,
      form: {},
      newAccount: false
    }
  },
  computed: {
    header(this: any) {
      if (this.view == "verify-email") {
        return {
          title: "Verify Email",
          subTitle: "Please check your inbox for a verification email."
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
      } else if (this.newAccount) {
        return {
          title: "Sign Up",
          subTitle: "Create A New Account"
        }
      } else if (isLoggedIn()) {
        return {
          title: "Logged In",
          subTitle: "You are successfully logged in."
        }
      } else {
        return {
          title: "Login",
          subTitle: "Enter your account details."
        }
      }
    },
    view(this: any) {
      return this.$route.query._action || this.$route.query.view || ""
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

    if (newAccount) {
      this.newAccount = true
    }
  },
  methods: {
    sendPasswordResetEmail,
    verifyAndResetPassword,
    isLoggedIn,
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

      const user = await authenticate({ ...this.form, newAccount: this.newAccount })

      if (user) this.done(user)

      this.loading = false
    },

    setView(this: any, view?: string) {
      const query = view ? { view } : {}
      this.$router.replace({ query })
    },

    done(this: any, user: CurrentUserState) {
      if (user && user.email) {
        emitEvent("notify", { message: `Signed in as ${user.email}` })
      }

      this.$emit("done", user)

      if (this.redirectPath) {
        userInitialized((user: CurrentUserState) => {
          if (user && user._id && this.redirectPath) {
            this.$router.push({ path: this.redirectPath })
          }
        })
      } else {
        this.setView(null)
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
