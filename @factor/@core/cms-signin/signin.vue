<template>
  <div class="signin ui-dashboard" data-test="signin">
    <template v-if="forgotPassword">
      <template v-if="passwordEmailSent">
        <div class="signin-header">
          <div class="title">Reset Email Sent</div>
          <div class="sub-title">Check your inbox for instructions on recovering your password.</div>
        </div>
      </template>

      <template v-else>
        <factor-form ref="password-form">
          <dashboard-input
            v-model="form.email"
            data-test="input-password-email"
            input="factor-input-email"
            required
            placeholder="Email"
            @keyup.enter="passwordResetEmail()"
          />
        </factor-form>
        <dashboard-btn
          :loading="loading"
          data-test="send-password-email"
          btn="secondary"
          text="Send Password Reset Email"
          @click="passwordResetEmail()"
        />
      </template>
    </template>
    <template v-else-if="view == 'profilePhoto'">
      <div class="signin-header">
        <div class="title">Profile Photo</div>
        <div class="sub-title">Set your primary account picture.</div>
      </div>
      <dashboard-input
        v-model="form.photosProfile"
        input="factor-input-image-upload"
        input-destination="/user/__uid/__name"
        input-max="1"
        required
        @autosave="updateUser( )"
      />
      <dashboard-btn btn="default" text="Skip" @click="checkEmailVerification()" />
    </template>

    <template v-else-if="view == 'verifyEmail'">
      <div class="signin-header">
        <div class="title">Verify Email</div>
        <div class="sub-title">Please check your inbox for a verification email.</div>
      </div>
      <dashboard-btn btn="default" text="Finish" @click="done()" />
    </template>
    <template v-else>
      <div v-if="$stack.covered('auth-provider-tokens-google')">
        <dashboard-btn
          data-test="google-button"
          :loading="loading === 'google'"
          class="fi-btn-default"
          text="Continue With Google"
          :image="require('./img/logo-google.svg')"
          circle="darkcolor"
          @click="signIn('google')"
        />
        <div class="sep">
          <span class="text">or</span>
        </div>
      </div>

      <factor-form ref="email-form">
        <dashboard-input
          v-if="newAccount"
          v-model="form.displayName"
          input="factor-input-text"
          data-test="signin-name"
          required
          placeholder="Full Name"
          @keyup.enter="signIn('email')"
        />
        <dashboard-input
          v-model="form.email"
          input="factor-input-email"
          data-test="signin-email"
          required
          placeholder="Email"
          @keyup.enter="signIn('email')"
        />
        <dashboard-input
          v-model="form.password"
          input="factor-input-password"
          data-test="signin-password"
          autocomplete="new-password"
          required
          placeholder="Password"
          @keyup.enter="signIn('email')"
        />

        <!-- <recaptcha v-if="newAccount" @solved="solved = $event" /> -->
        <div class="action">
          <dashboard-btn
            data-test="submit-login"
            :loading="loading === 'email'"
            btn="primary"
            :text="`${newAccount ? 'Sign Up' : 'Login'} With Email`"
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
  components: {
    // recaptcha: () => import("./p-modal-auth-recaptcha.vue")
  },
  props: {
    redirect: { type: String, default: "" }
  },
  data() {
    return {
      errors: [],
      loading: false,
      form: {},
      newAccount: false,
      forgotPassword: false,
      passwordEmailSent: false,

      solved: false
    }
  },
  computed: {
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
    async passwordResetEmail() {
      const r = this.$refs["password-form"].$el.reportValidity()
      if (!r) {
        return
      }
      this.loading = true
      try {
        await this.$auth.sendPasswordReset(this.form)
        this.passwordEmailSent = true
      } catch (error) {
        this.$events.$emit("error", error)
      }
      this.loading = false
    },

    async signIn(method) {
      this.errors = []

      try {
        if (method == "email") {
          const r = this.$refs["email-form"].$el.reportValidity()

          if (!r) {
            return
          }
        }
        this.loading = method

        const credentials = await this.$auth.authenticate({
          provider: method,
          form: this.form,
          newAccount: this.newAccount
        })

        this.credentials = credentials

        if (this.newAccount) {
          this.setView("profilePhoto")
        } else if (credentials) {
          this.done()
        }
      } catch (error) {
        console.error(error)
        this.$events.$emit("error", error)
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

    done() {
      const { user } = this.credentials
      this.$events.$emit("notify", {
        message: `Signed in as ${user.email}`
      })

      this.$emit("done", this.credentials)

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
  margin: 3em auto;
  width: 300px;
  text-align: center;
  .signin-header {
    margin-bottom: 1.5em;
    .title {
      font-size: 1.3em;
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
