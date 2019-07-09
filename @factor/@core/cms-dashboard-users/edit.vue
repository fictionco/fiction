<template>
  <dashboard-page>
    <div class="user-dashboard-post-grid">
      <div class="content-column">
        <dashboard-pane :title="id == $userId ? 'Your Account' : 'Edit User'" class="compose">
          <dashboard-input
            v-model="user.displayName"
            input="factor-input-text"
            label="Display Name"
            class="post-title"
          />

          <dashboard-input
            v-model="user.username"
            input="factor-input-text"
            label="Username"
            description="Must be unique."
          />

          <dashboard-input
            v-model="user.email"
            class="email-inputs"
            input="factor-input-email"
            label="Email Address"
          >
            <div v-if="user.email && !user.emailVerified">
              <dashboard-btn size="tiny" btn="subtle">Unverified</dashboard-btn>
              <dashboard-btn size="tiny" :loading="sending" @click="sendVerifyEmail()">Resend Email</dashboard-btn>
            </div>
          </dashboard-input>

          <dashboard-input
            v-model="user.password"
            input="factor-input-password"
            label="Update Password"
            autocomplete="new-password"
          />
        </dashboard-pane>

        <dashboard-pane title="Profile">
          <dashboard-input
            v-model="user.images"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Profile Photo(s)"
            :loading="loading"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="user.covers"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Cover Photo(s)"
            :loading="loading"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="user.about"
            input="factor-input-textarea"
            label="About You"
            placeholder="Work, hobbies, travels, etc..."
          />
          <dashboard-input
            v-model="user.birthday"
            input="factor-input-birthday"
            label="Birthday"
            description="This information is not shared."
          />
          <dashboard-input
            v-model="user.gender"
            :list="['female', 'male']"
            input="factor-input-select"
            label="Gender"
            description="This information is not shared."
          />
          <div class="user-info">
            <div class="item">
              <div class="label">Logged In</div>
              <div class="value">{{ $time.niceFormat(user.signedInAt) }}</div>
            </div>

            <div class="item">
              <div class="label">Signed up</div>
              <div class="value">{{ $time.niceFormat(user.createdAt) }}</div>
            </div>
          </div>
        </dashboard-pane>
      </div>

      <div class="meta-column">
        <dashboard-pane class="post-actions">
          <template slot="actions">
            <dashboard-btn btn="primary" :loading="sending" @click="save()">
              Save
              &nbsp;
              <factor-icon icon="arrow-up" />
            </dashboard-btn>
          </template>
        </dashboard-pane>
      </div>
    </div>
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "provider-link": () => import("./provider")
  },
  data() {
    return {
      user: {},
      sending: false,
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id || this.$userId
    },
    url() {
      return this.user.username
        ? `/@${this.user.username}`
        : `/@?id=${this.user._id}`
    }
  },

  async mounted() {
    this.$user.init(async user => {
      this.user = user

      this.user = await this.$db.populate(this.user, ["images", "photosCover"])
    })
  },
  methods: {
    async sendVerifyEmail() {
      this.sending = true
      await this.$userEmails.sendVerifyEmail({
        email: this.user.email,
        _id: this.user._id
      })
      this.sending = false
    },
    saveObject(user) {
      const _save = {} // mutable

      let { images, photosCover, photoPrimary } = user

      _save.images = images
        .filter(_ => _)
        .map(_ => (typeof _ == "object" ? _._id : _))
      _save.photosCover = photosCover
        .filter(_ => _)
        .map(_ => (typeof _ == "object" ? _._id : _))

      _save.photoPrimary =
        _save.images.length > 0 ? _save.images[0] : undefined

      return { ...user, ..._save }
    },
    async save() {
      this.sending = true

      const toSave = this.saveObject(this.user)

      console.log("TOSAVE", toSave)

      let savedUser = await this.$user.request("save", toSave)

      if (savedUser) {
        console.log("Saved User Information", savedUser)

        this.$events.$emit("notify", `User Saved`)
      }

      this.sending = false
    }
  }
}
</script>


<style lang="less">
.user-dashboard-post-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 3fr minmax(230px, 1fr);

  @media (max-width: 960px) {
    grid-gap: 1em 0;
  }
  .dashboard-pane {
    margin-bottom: 1em;
  }

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
    }
  }
  .compose {
    min-height: 500px;
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