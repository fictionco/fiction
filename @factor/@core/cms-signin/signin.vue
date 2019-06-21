<template>
  <div class="signin" data-test="signin">
    <div class="signin-header">
      <div class="title">{{ header.title }}</div>
      <div class="sub-title">{{ header.subTitle }}</div>
    </div>
    <template v-if="forgotPassword">
      <template v-if="passwordEmailSent" />

      <template v-else>
        <factor-form ref="password-form">
          <dashboard-input
            v-model="form.email"
            data-test="input-password-email"
            input="factor-input-email"
            required
            placeholder="Email"
            @keyup.enter="trigger('submit-reset')"
          />
        </factor-form>
        <dashboard-btn
          ref="submit-reset"
          :loading="loading"
          data-test="send-password-email"
          btn="secondary"
          text="Send Password Reset Email"
          @click="passwordResetEmail()"
        />
      </template>
    </template>

    <template v-else-if="view == 'verifyEmail'">
      <dashboard-btn btn="default" text="Finish" @click="done()" />
    </template>
    <template v-else>
      <factor-form ref="email-form">
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
          <dashboard-btn
            ref="submit"
            data-test="submit-login"
            :loading="loading"
            btn="primary"
            :text="newAccount ? 'Sign Up' : 'Login'"
            @click="signIn('email')"
          />
        </div>
      </factor-form>
    </template>
    <div v-if="!view" class="alt-links">
      <template v-if="newAccount">
        <div class="forgot-password alternative-action-link">
          Have an account?
          <a
            href="#"
            data-test="link-login"
            @click.prevent="newAccount = false; forgotPassword = false; passwordEmailSent = false"
          >Login</a>
        </div>
      </template>
      <template v-else-if="forgotPassword">
        <div class="alternative-action-link">
          <a
            href="#"
            data-test="link-back"
            @click.prevent="newAccount = false; forgotPassword = false; passwordEmailSent = false"
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
            @click.prevent="forgotPassword = true"
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
      newAccount: false,
      forgotPassword: false,
      passwordEmailSent: false
    }
  },
  computed: {
    header() {
      if (this.view == "verifyEmail") {
        return {
          title: "Verify Email",
          subTitle: "Please check your inbox for a verification email."
        }
      } else if (this.passwordEmailSent && this.forgotPassword) {
        return {
          title: "Reset Email Sent",
          subTitle:
            "Check your inbox for instructions on recovering your password."
        }
      } else if (this.forgotPassword) {
        return {
          title: "Password Reset",
          subTitle: "Enter your account email address."
        }
      } else if (this.newAccount) {
        return {
          title: "Sign Up",
          subTitle: "Create A New Account"
        }
      } else {
        return {
          title: "Login",
          subTitle: "Enter your account details."
        }
      }
    },
    view() {
      return this.$route.query.signInView || ""
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
      this.$refs[ref].$el.click()
    },
    async passwordResetEmail() {
      const r = this.$refs["password-form"].$el.reportValidity()
      if (!r) {
        return
      }
      this.loading = true
      try {
        await this.$user.sendPasswordReset(this.form)
        this.passwordEmailSent = true
      } catch (error) {
        this.$events.$emit("error", error)
      }
      this.loading = false
    },

    async signIn() {
      this.errors = []

      const r = this.$refs["email-form"].$el.reportValidity()
      if (!r) return

      this.loading = true

      const user = await this.$user.authenticate({
        ...this.form,
        newAccount: this.newAccount
      })

      if (user) {
        this.$user.setCurrentUser(user)
        this.done(user)
      }

      this.loading = false
    },
    async updateUser() {
      await this.$user.save(this.form)

      this.checkEmailVerification()
    },
    setView(signInView) {
      this.$router.replace({ query: { signInView } })
    },

    checkEmailVerification() {
      if (!this.$user.emailVerified) {
        this.setView("verifyEmail")
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
  .signin-header {
    margin-bottom: 1.5em;
    .title {
      font-size: 1.6em;
      font-weight: var(--font-weight-bold);
    }
    .sub-title {
      font-weight: 500;
      opacity: 0.7;
      line-height: 1.2;
    }
  }
  .alt-links {
    margin-top: 2em;
    text-align: center;
    font-weight: 500;
    font-size: 0.9em;
    line-height: 1.5;
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
