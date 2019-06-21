
<template>
  <div class="provider-input">
    <template v-if="account === 'email'">
      <div v-if="!connected" class="item not-verified">
        <div class="status-text">Unverified</div>
        <dashboard-btn
          :loading="sending"
          size="small"
          @click="connection('email', 'add')"
        >Email Link</dashboard-btn>
      </div>
      <div v-else class="item verified">
        <div class="status-text">Verified</div>
      </div>
    </template>
    <template v-else>
      <div v-if="!connected" class="item not-verified">
        <div class="status-text">Not Connected</div>
        <dashboard-btn
          :loading="sending"
          :btn="account"
          size="small"
          @click="connection(account, 'add')"
        >Connect</dashboard-btn>
      </div>
      <div v-else class="item verified">
        <div class="status-text">{{ email }}</div>
        <dashboard-btn
          size="small"
          :loading="sending"
          @click="connection(account, 'remove')"
        >Disconnect</dashboard-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { setTimeout } from "timers"
export default {
  props: {
    account: { type: String, default: "" },
    label: { type: String, default: "" }
  },
  data() {
    return {
      sending: false,
      loaded: false
    }
  },
  computed: {
    loading() {
      return this.sending
    },
    connected() {
      return this.accountData.verified
    },
    email() {
      return this.accountData.email
    },
    accountData() {
      let data = { verified: false }

      if (!this.loaded) {
        return data
      }

      const { email, emailVerified, auths } = this.$user.currentUser()
      const { phone, facebook, google } = auths || {}
      const a = this.account

      if (this.account === "email") {
        data = {
          verified: emailVerified,
          email,
          uid: email
        }
      } else if (this.account === "google") {
        const info = auths.find(({ providerId }) => providerId == "google.com")
        const { email, uid } = info || {}
        data = {
          verified: info ? true : false,
          email,
          uid
        }
      }

      return data
    }
  },
  mounted() {
    this.$user.init(() => {
      setTimeout(() => {
        this.loaded = true
      }, 10)
    })
  },
  methods: {
    async connection(provider, action) {
      this.sending = true
      if (action == "add") {
        await this.$auth.addAuthMethod({ provider })
      } else {
        await this.$auth.removeAuthMethod({ provider })
      }

      this.sending = false
    }
  }
}
</script>
<style lang="less">
.provider-input {
  font-size: 0.85em;
  font-weight: 500;
  display: inline-block;
  box-shadow: inset var(--input-shadow);

  background-color: var(--input-bg);
  border-radius: 5px;
  .item {
    padding: 0.5em 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .status-text {
      display: inline-block;
    }
    .factor-btn {
      margin-left: 1.5em;
    }
  }
}
</style>
