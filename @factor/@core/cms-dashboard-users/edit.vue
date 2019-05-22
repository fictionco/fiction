<template>
  <dashboard-page>
    <div class="user-dashboard-post-grid">
      <div class="content-column">
        <dashboard-pane :title="id == $uid ? 'Your Account' : 'Edit User'" class="compose">
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
            <provider-link account="email" />
          </dashboard-input>

          <dashboard-input
            v-model="user.password"
            input="factor-input-password"
            label="Update Password"
            autocomplete="new-password"
          />

          <dashboard-input label="Google Account">
            <provider-link account="google" />
          </dashboard-input>
        </dashboard-pane>

        <dashboard-pane title="Profile">
          <dashboard-input
            v-model="user.photosProfile"
            input-destination="/user/__uid/__guid.__ext"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Profile Photo(s)"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="user.photosCover"
            input-destination="/user/__uid/__guid.__ext"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Cover Photo(s)"
            @autosave="$emit('autosave')"
          />
          <dashboard-input
            v-model="user.bio"
            input="factor-input-textarea"
            label="Bio"
            placeholder="Work, hobbies, travels, etc..."
          />
          <dashboard-input
            v-model="user.birthday"
            input="factor-input-birthday"
            label="Birthday"
            description="This data is for analysis and not shared."
          />
          <dashboard-input
            v-model="user.gender"
            :list="['female', 'male']"
            input="factor-input-select"
            label="Gender"
            description="This data is for analysis and not shared."
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
        <dashboard-pane title="Save" class="post-actions">
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
      sending: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id || this.$uid
    },
    url() {
      return this.user.username
        ? `/@${this.user.username}`
        : `/@?id=${this.user.uid}`
    }
  },
  async mounted() {
    this.$user.init(async () => {
      this.user = await this.$user.requestFullUser(this.id)
    })
  },
  methods: {
    async save() {
      this.sending = true

      try {
        let savedUser = await this.$user.save(this.user)

        if (savedUser) {
          this.$set(this, "user", savedUser)

          this.$events.$emit("notify", `User Saved`)
        }
      } catch (error) {
        console.log(error)
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
  grid-template-columns: 1fr 275px;

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