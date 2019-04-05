<template>
  <dashboard-page>
    <div class="post-grid">
      <div class="content-column">
        <dashboard-pane :title="id == $uid ? 'Your Account' : 'Edit User'" class="compose">
          <factor-input-wrap
            v-model="user.displayName"
            input="factor-input-text"
            label="Display Name"
            class="post-title"
          />
          <factor-input-wrap
            v-model="user.images"
            input="factor-input-image-upload"
            label="Images"
          />

          <factor-input-wrap v-model="user.email" input="factor-input-email" label="Email Address" />

          <factor-input-wrap
            v-model="user.birthday"
            input="factor-input-birthday"
            label="Birthday"
            description="This data is for analysis and not shared."
          />
          <factor-input-wrap
            v-model="user.gender"
            :list="['female', 'male']"
            input="factor-input-select"
            label="Gender"
            description="This data is for analysis and not shared."
          />
          <factor-input-wrap
            v-model="user.photosProfile"
            input-destination="/user/__uid/__guid.__ext"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Photos"
            @autosave="$emit('autosave')"
          />
          <factor-input-wrap
            v-model="user.photosCover"
            input-destination="/user/__uid/__guid.__ext"
            input-max="5"
            input-min="1"
            input="factor-input-image-upload"
            label="Covers"
            @autosave="$emit('autosave')"
          />
          <factor-input-wrap
            v-model="user.bio"
            input="factor-input-textarea"
            label="Bio"
            placeholder="Work, hobbies, travels, etc..."
          />
        </dashboard-pane>
      </div>
      <div class="meta-column">
        <dashboard-pane title="Info" class="post-actions">
          <ul class="user-info">
            <li>
              <div class="label">Logged In</div>
              <div class="value">{{ $time.niceFormat(user.signedInAt) }}</div>
            </li>

            <li>
              <div class="label">Signed up</div>
              <div class="value">{{ $time.niceFormat(user.createdAt) }}</div>
            </li>
          </ul>
          <template slot="actions">
            <factor-btn btn="primary" :loading="sending" @click="save()">
              Save
              &nbsp;
              <i class="fa fa-arrow-up" />
            </factor-btn>
          </template>
        </dashboard-pane>
      </div>
    </div>
  </dashboard-page>
</template>
<script>
export default {
  data() {
    return {
      user: {},
      sending: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id || this.$uid
    }
  },
  async mounted() {
    this.user = await this.$user.requestFullUser(this.id)
  },
  methods: {
    async save() {
      this.sending = true

      await this.$user.dbUserUpdate(this.user)

      this.$events.$emit("notify", `User Saved`)

      this.sending = false
    }
  }
}
</script>


<style lang="less">
.post-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  //grid-template-rows: 1fr 1fr 1fr 1fr;
  @media (max-width: 960px) {
    grid-gap: 1em 0;
  }
  .dashboard-pane {
    margin-bottom: 1em;
  }
  .content-column {
    grid-column: span 2;
  }
  .content-column,
  .meta-column {
    min-width: 0;
    @media (max-width: 960px) {
      grid-column: span 3;
    }
  }
  .compose {
    min-height: 500px;
  }
}
.user-info {
  list-style: none;
  line-height: 1.5;
  padding: 0;
  li {
    margin: 0 0 1em;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .label {
    font-weight: 600;
  }
}
</style>