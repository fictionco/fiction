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
        <factor-btn-app
          ref="forgot-password"
          :loading="loading"
          data-test="send-password-email"
          text="Send Password Reset Email"
          @click="send({action: `sendPasswordResetEmail`, next: `password-email-sent`})"
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
        <factor-btn-app
          ref="reset-password"
          :loading="loading"
          text="Reset Password"
          @click="send({action: `verifyAndResetPassword`, next: `successful-password-reset`})"
        />
      </template>

      <template v-else-if="!view && $user.isLoggedIn()">
        <div class="action">
          <dashboard-link btn="primary" text="Account" path="/dashboard/account" />
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
          autocomplete="new-password"
          required
          placeholder="Password"
          @keyup.enter="trigger('submit')"
        />

        <div class="action">
          <factor-btn-app
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


<script>
export default {
  components: {},
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
    header() {
      if (this.view == "verify-email") {
        return {
          title: "Verify Email",
          subTitle: "Please check your inbox for a verification email."
        }
      } else if (this.view == "password-email-sent") {
        return {
          title: "Reset Email Sent",
          subTitle:
            "Check your inbox for instructions on recovering your password."
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
      } else if (this.$user.isLoggedIn()) {
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
    view() {
      return this.$route.query._action || this.$route.query.view || ""
    },
    mode() {
      return this.$route.query.mode || "continue"
    },
    redirectPath() {
      const defaultRedirect = this.$route.name == "signin" ? "/" : false
      return this.redirect
        ? this.redirect
        : this.$route.query.redirect || defaultRedirect
    }
  },
  methods: {
    trigger(ref) {
      this.$refs[ref].$el.focus()
      this.$refs[ref].$el.click()
    },
    async send({ action, next }) {
      const r = this.$refs["signin-form"].$el.reportValidity()

      if (!r) return

      this.loading = true

      const args = { ...this.form, ...this.$route.query }
      const result = await this.$userEmails[action](args)

      if (result) {
        this.setView(next)
      }

      this.loading = false
    },

    async signIn() {
      this.errors = []

      const r = this.$refs["signin-form"].$el.reportValidity()
      if (!r) return

      this.loading = true

      const user = await this.$user.authenticate({
        ...this.form,
        newAccount: this.newAccount
      })

      console.log("done auth", user)

      if (user) {
        // this.$user.setUser({ user, current: true })
        this.done(user)
      }

      this.loading = false
    },
    async updateUser() {
      await this.$user.save(this.form)

      this.checkEmailVerification()
    },
    setView(view) {
      const query = { view }
      this.$router.replace({ query })
    },

    checkEmailVerification() {
      if (!this.$user.emailVerified) {
        this.setView("verify-email")
      }
    },

    done(user) {
      if (user.email) {
        this.$events.$emit("notify", {
          message: `Signed in as ${user.email}`
        })
      }

      this.$emit("done", user)

      if (this.redirectPath) {
        this.$user.init(uid => {
          if (uid && this.redirectPath) {
            this.$router.push({ path: this.redirectPath })
          }
        })
      } else {
        this.setView(null)
      }
    }
  }
}
</script>

<style lang="less">
.signin {
  margin: 1em auto 1em;
  width: 300px;
  text-align: center;
  form {
    font-size: 1.2em;
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
