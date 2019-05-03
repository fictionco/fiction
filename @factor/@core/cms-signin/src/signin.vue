<template>
  <div class="signin" data-test="signin">
    <template v-if="forgotPassword">
      <template v-if="passwordEmailSent">
        <div class="confirm">
          <div class="title">Reset Email Sent</div>
          <div class="sub-title">Check your inbox for instructions on recovering your password.</div>
        </div>
      </template>
      <template v-else>
        <factor-form ref="password-form">
          <factor-input-email
            v-model="form.email"
            data-test="input-password-email"
            required
            placeholder="Email"
            @keyup.enter="passwordResetEmail()"
          />
        </factor-form>
        <factor-btn
          :loading="loading"
          data-test="send-password-email"
          btn="secondary"
          text="Send Password Reset Email"
          :image="require('./img/email.svg')"
          @click="passwordResetEmail()"
        />
      </template>
    </template>
    <template v-else>
      <factor-btn
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
        <span class="line" />
      </div>

      <factor-form ref="email-form">
        <factor-input-text
          v-if="newAccount"
          v-model="form.displayName"
          data-test="signin-name"
          required
          placeholder="Full Name"
          @keyup.enter="signIn('email')"
        />
        <factor-input-email
          v-model="form.email"
          data-test="signin-email"
          required
          placeholder="Email"
          @keyup.enter="signIn('email')"
        />
        <factor-input-password
          v-model="form.password"
          data-test="signin-password"
          autocomplete="new-password"
          required
          placeholder="Password"
          @keyup.enter="signIn('email')"
        />
        <!-- <recaptcha v-if="newAccount" @solved="solved = $event" /> -->
        <div class="action">
          <factor-btn
            data-test="submit-login"
            :loading="loading === 'email'"
            btn="primary"
            :image="require('./img/email.svg')"
            :text="`${newAccount ? 'Sign Up' : 'Login'} With Email`"
            @click="signIn('email')"
          />
        </div>
      </factor-form>
    </template>
    <div class="alt-links">
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
        await this.$auth.sendPasswordResetEmail(this.form)
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
          if (this.newAccount && !this.solved && !this.$testing.isTest) {
            throw new Error("Please solve the captcha.")
          }
        }
        this.loading = method

        const credentials = await this.$auth.authenticate({
          provider: method,
          form: this.form,
          newAccount: this.newAccount
        })

        if (credentials) {
          const { user } = credentials

          this.$events.$emit("notify", {
            message: `Signed in as ${user.email}`
          })

          this.$emit("done", credentials)
          console.log("SHOULD RE", this.redirectPath)
          this.$user.init(uid => {
            if (uid && this.redirectPath) {
              this.$router.push({ path: this.redirectPath })
            }
          })
        }
      } catch (error) {
        this.$events.$emit("error", error)
      }

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.signin {
  margin: 3em auto;
  width: 250px;
  text-align: center;

  .alt-links {
    margin-top: 2em;
    text-align: center;
    font-weight: 500;
    font-size: 0.9em;
    line-height: 1.5;
    a {
      cursor: pointer;
      color: #0496ff;
      &:hover {
        color: #ff0076;
      }
    }
  }

  .sep {
    position: relative;
    margin: 1em 0;
    text-align: center;

    font-style: italic;
    .text {
      color: #ddd;
      padding: 0 1em;
      background: #fff;
      z-index: 10;
      position: relative;
    }
    .line {
      position: absolute;
      top: 50%;
      height: 1px;
      border-bottom: 1px dotted #ddd;
      width: 100%;
      left: 0;
    }
  }
  .action {
    margin-top: 1em;
  }
  .f-input-wrap {
    margin: 1.5em 0;
  }

  input {
    margin: 0.5em 0;
  }

  input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
  textarea,
  select {
    font-size: 1.1em;
    background-color: #fff;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px;

    width: 100%;
  }
}
</style>
