<template>
  <dashboard-page>
    <div class="post-grid">
      <div class="content-column">
        <dashboard-pane title="User" class="compose">
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
      return this.$route.query.id
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
  .dashboard-pane {
    margin-bottom: 1em;
  }
  .content-column,
  .meta-column {
    min-width: 0;
  }
  .content-column {
    grid-column: span 2;
    //grid-row: span 4;
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