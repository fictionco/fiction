<template>
  <dashboard-page>
    <div class="user-dashboard-post-grid">
      <div class="content-column">
        <dashboard-pane
          :title="_id == userId() ? 'Your Account' : 'Edit User'"
          class="compose inputs"
        >
          <dashboard-input
            v-model="post.displayName"
            input="factor-input-text"
            label="Display Name"
            class="post-title"
          />

          <dashboard-input
            v-model="post.username"
            input="factor-input-text"
            label="Username"
            description="Must be unique."
          />

          <dashboard-input
            v-model="post.email"
            class="email-inputs"
            input="factor-input-email"
            label="Email Address"
          >
            <div v-if="post.email && !post.emailVerified">
              <factor-btn-dashboard size="tiny" btn="subtle">Unverified</factor-btn-dashboard>
              <factor-btn-dashboard
                size="tiny"
                :loading="sending"
                @click="sendVerifyEmail()"
              >Resend Email</factor-btn-dashboard>
            </div>
          </dashboard-input>

          <dashboard-input
            v-model="post.password"
            input="factor-input-password"
            label="Update Password"
            autocomplete="new-password"
          />
          <template #actions>
            <factor-btn-dashboard btn="primary" :loading="sending" @click="save()">
              Save &nbsp;
              <factor-icon icon="arrow-up" />
            </factor-btn-dashboard>
          </template>
        </dashboard-pane>

        <dashboard-pane title="Profile" class="inputs">
          <dashboard-input
            v-model="post.images"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Profile Photo(s)"
            :loading="loading"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="post.covers"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Cover Photo(s)"
            :loading="loading"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="post.about"
            input="factor-input-textarea"
            label="About You"
            placeholder="Work, hobbies, travels, etc..."
          />
          <dashboard-input
            v-model="post.birthday"
            input="factor-input-birthday"
            label="Birthday"
            description="This information is not shared."
          />
          <dashboard-input
            v-model="post.gender"
            :list="['female', 'male']"
            input="factor-input-select"
            label="Gender"
            description="This information is not shared."
          />
          <div class="user-info">
            <div class="item">
              <div class="label">Logged In</div>
              <div class="value">{{ standardDate(post.signedInAt) }}</div>
            </div>

            <div class="item">
              <div class="label">Signed up</div>
              <div class="value">{{ standardDate(post.createdAt) }}</div>
            </div>
          </div>
          <template #actions>
            <factor-btn-dashboard btn="primary" :loading="sending" @click="save()">
              Save &nbsp;
              <factor-icon icon="arrow-up" />
            </factor-btn-dashboard>
          </template>
        </dashboard-pane>
        <slot name="edit" />
      </div>
    </div>
  </dashboard-page>
</template>
<script lang="ts">
import { dashboardPage, dashboardPane, dashboardInput } from "@factor/dashboard"
import { factorBtnDashboard, factorIcon } from "@factor/ui"
import { userId, sendVerifyEmail } from "@factor/user"
import { standardDate, emitEvent, stored, storeItem } from "@factor/api"
import { requestPostSave } from "@factor/post/request"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    dashboardPage,
    dashboardPane,
    dashboardInput,
    factorBtnDashboard
  },
  data() {
    return {
      sending: false,
      loading: false,
      postType: "user"
    }
  },
  computed: {
    post: {
      get() {
        return stored(this._id) || {}
      },
      set(v) {
        storeItem(this._id, v)
      }
    },

    profile() {
      return this.post.profile || {}
    },
    _id() {
      return this.$route.query._id || userId()
    },
    url() {
      return this.post.username ? `/@${this.post.username}` : `/@?_id=${this.post._id}`
    }
  },

  methods: {
    userId,
    standardDate,
    async sendVerifyEmail(this: any) {
      this.sending = true
      await sendVerifyEmail({
        email: this.post.email,
        _id: this.post._id
      })
      this.sending = false
    },
    async save() {
      this.sending = true

      const saved = await requestPostSave({
        post: this.post,
        postType: this.postType
      })

      if (saved) {
        this.post = saved
        emitEvent("notify", `Saved!`)
      }

      this.sending = false
    }
  }
})
</script>

<style lang="less">
.user-dashboard-post-grid {
  display: grid;
  // grid-gap: 1em;
  // grid-template-columns: 3fr minmax(230px, 1fr);

  // @media (max-width: 960px) {
  //   grid-gap: 1em 0;
  // }

  .content-column,
  .meta-column {
    min-width: 0;
    @media (max-width: 960px) {
      grid-column: span 3;
    }
  }
  @media (max-width: 960px) {
    .meta-column {
      .foot {
        justify-content: center;
      }
    }
  }

  .meta-column {
    .post-actions {
      position: sticky;
      top: 1em;
      @media (max-width: 767px) {
        position: fixed;
        bottom: 0;
        top: auto;
        width: 100%;
        left: 0;
      }
    }
  }
  .compose .cont {
    min-height: 20vh;
  }

  .email-inputs {
    .the-input {
      display: flex;
      > * {
        margin-right: 1em;
      }
    }
  }
}
.user-info {
  list-style: none;
  line-height: 1.5;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 4em 0;
  .label {
    opacity: 0.4;
    font-weight: var(--font-weight-bold);
  }
}
</style>
