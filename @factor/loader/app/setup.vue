<template>
  <div class="setup">
    <div class="pages">
      <router-link
        v-for="page in 3"
        :key="page"
        :to="`/setup?step=${page}`"
        class="pg"
        :class="step == page ? 'active' : ''"
      >{{ page }}</router-link>
    </div>
    <div v-if="step == 1" class="page-item">
      <div class="header">
        <div class="title">Welcome to Factor</div>
        <div class="sub-title">Congratulations! Let's get you setup.</div>
      </div>
      <div class="actions">
        <router-link class="btn" to="/setup?step=2">Create Your Account &rarr;</router-link>
      </div>
    </div>
    <div v-if="step == 2" class="page-item">
      <div class="header">
        <div class="title">Create Your Account</div>
      </div>
      <form class="setup-form">
        <div class="input-item">
          <label>Site Title</label>
          <input type="text" />
        </div>
        <div class="input-item">
          <label>Full Name</label>
          <input type="text" />
        </div>
        <div class="input-item">
          <label>Email</label>
          <input type="email" />
        </div>
        <div class="input-item">
          <label>Password</label>
          <input type="password" />
        </div>
      </form>

      <div class="actions">
        <router-link class="btn" to="/setup?step=2">Create &rarr;</router-link>
      </div>
    </div>
    <div v-if="step == 3" class="page-item">
      <div class="header">
        <div class="title">All Set</div>
        <div class="sub-title">Your app is all set up, next step is customization</div>
      </div>
      <div class="actions">
        <router-link class="btn" to="/">Build App &rarr;</router-link>
      </div>
    </div>
  </div>
</template>
<script >
import Vue from "vue"

export default Vue.extend({
  computed: {
    step() {
      return this.$route.query.step ?? 1
    }
  }
})
</script>


<style lang="less">
.setup {
  .pages {
    display: flex;
    justify-content: center;
    padding: 2rem 1rem;
    .pg {
      text-decoration: none;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      border-radius: 50%;
      border: 3px solid #0471ff;
      color: #0471ff;
      font-weight: 800;
      font-size: 1.2em;
      margin: 0.5rem;

      &.active {
        background: #0471ff;
        color: #fff;
      }
    }
  }
  .header {
    text-align: center;
    margin: 3rem 0;
    .title {
      letter-spacing: -0.02em;
      font-weight: 500;
      font-size: 2.6em;
      margin-bottom: 1rem;
    }
    .sub-title {
      opacity: 0.7;
      font-size: 1.2em;
    }
  }
  .setup-form {
    max-width: 380px;
    padding: 2rem;
    margin: 0 auto;
    .input-item {
      margin: 1rem 0;
      input {
        font-size: 1.3rem;
      }
    }
    label {
      display: block;
      font-weight: 600;

      margin-bottom: 0.5rem;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
  }
}
</style>
