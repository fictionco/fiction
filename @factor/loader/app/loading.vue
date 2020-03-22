<template>
  <div class="loading-screen" :class="{ hide: allDone && !preventReload }">
    <div class="factor-logo-area">
      <transition appear>
        <factor-logo />
      </transition>
    </div>
    <div class="loading-area">
      <div v-if="hasErrors && !errorDescription" class="error-item">
        <h3 class="hasErrors">An error occured, please look at Factor terminal.</h3>
      </div>
      <div v-else-if="hasErrors && errorDescription" class="error-item">
        <h3
          class="hasErrors"
        >An error occured, please see below or look at Factor terminal for more info.</h3>
        <div class="errorStack">
          <p class="hasErrors">{{ errorDescription }}</p>
          <p v-if="errorStack" class="pre">{{ errorStack }}</p>
        </div>
        <p>
          <span class="hasErrors">Note:</span> A manual restart of the Factor dev server may be required
        </p>
      </div>
      <div v-else-if="preventReload" class="reload-prevented error-item">
        <h3 class="hasErrors">Failed to show Factor app after {{ maxReloadCount }} reloads</h3>
        <p>Your Factor app could not be shown even though the webpack build appears to have finished.</p>
        <p>Try to reload the page manually, if this problem persists try to restart your Factor dev server.</p>
      </div>
      <template v-else>
        <transition appear>
          <div class="row progress-bar-wrap" :class="build">
            <div class="progress-title">{{ building }}</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: `${progress}%` }" />
            </div>
            <div class="progress-message">{{ progressText }}</div>
          </div>
        </transition>
      </template>
    </div>
  </div>
</template>



<script>
import fetch from "unfetch"

import capitalizeMixin from "./mixins/capitalize"
import logMixin from "./mixins/log"
import sseMixin from "./mixins/sse"
import storageMixin from "./mixins/storage"
import { sendEvent } from "./utils"

const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  components: {
    factorLogo: () => import("./logo-factor.vue")
  },
  mixins: [capitalizeMixin, logMixin, sseMixin, storageMixin],
  data() {
    return {
      error: false,
      stack: false,
      allDone: false,
      hasErrors: false,
      isFinished: false,
      maxReloadCount: 5,
      preventReload: false,
      manualReload: false,
      baseURL: window.$BASE_URL,
      progress: 0,
      message: "",
      build: ""
    }
  },
  computed: {
    progressText() {
      const showPercent = this.progress ? `${Math.round(this.progress)}%` : ""
      return `${this.cap(this.message)} ${showPercent}`
    },
    building() {
      return this.build == "bundle" ? "Building App" : "Setting Up Environment"
    }
  },

  beforeMount() {
    if (!this.canReload()) {
      this.preventReload = true
    }
  },

  mounted() {
    if (this.preventReload || !this.baseURL) {
      return
    }

    document.title = "Factor Loading"

    this.onData(window.$STATE)

    this.sseConnect(`${this.baseURL}_loading/sse`)
    this.setTimeout()
  },

  methods: {
    cap(text) {
      if (!text) return ""

      return text.replace(/\b\w/g, l => l.toUpperCase())
    },
    onSseData(data) {
      if (this._reloading) {
        return
      }

      // We have data from sse. Delay timeout!
      this.setTimeout()

      this.onData(data)
    },

    async fetchData() {
      if (this._reloading) {
        return
      }

      // Prevent any fetch happening during fetch
      this.clearTimeout()

      try {
        const data = await fetch(`${this.baseURL}_loading/json`).then(res => res.json())

        this.onData(data)
      } catch (error) {
        this.logError(error)
      }

      // Start next timeout
      this.setTimeout()
    },

    clearTimeout() {
      if (this._fetchTimeout) {
        clearTimeout(this._fetchTimeout)
      }
    },

    setTimeout() {
      if (this._reloading) {
        return
      }

      this.clearTimeout()
      this._fetchTimeout = setTimeout(() => this.fetchData(), 1000)
    },

    onData(data) {
      if (!data || this._reloading) {
        return
      }

      if (data.settings) {
        window.$STATE.settings = data.settings
      }

      if (data.redirect && !this.$route.path.includes(data.redirect)) {
        this.$router.replace({ path: data.redirect })
        delete window.$STATE.redirect
        sendEvent({ redirected: true })
        return
      }

      const { error, progress, message, hasErrors, allDone, build } = data

      if (error) {
        const { description, stack } = error

        this.errorDescription = description
        this.errorStack = stack
        this.hasErrors = true
        return
      }

      // Try to show the app if allDone and no errors
      if (!hasErrors && allDone && !this.allDone) {
        this.reload()
      }

      // Update state
      this.allDone = allDone
      this.hasErrors = hasErrors
      this.progress = progress
      this.message = message
      this.build = build
    },

    canReload() {
      this.reloadCount = parseInt(this.retrieveItem("reloadCount")) || 0
      const lastReloadTime = parseInt(this.retrieveItem("lastReloadTime")) || 0

      this.loadingTime = new Date().getTime()
      const canReload = this.reloadCount < this.maxReloadCount
      const reloadWasOutsideThreshold =
        lastReloadTime && this.loadingTime > 1000 + lastReloadTime

      // remove items when the last reload was outside our 1s threshold
      // or when we've hit the max reload count so eg when the user
      // manually reloads we start again with 5 tries
      if (!canReload || reloadWasOutsideThreshold) {
        this.removeItem("reloadCount")
        this.removeItem("lastReloadTime")
        this.reloadCount = 0

        return canReload
      }

      return true
    },

    updateReloadItems() {
      this.storeItem("reloadCount", 1 + this.reloadCount)
      this.storeItem("lastReloadTime", this.loadingTime)
    },

    async reload() {
      if (this._reloading) {
        return
      }
      this._reloading = true

      // Stop timers
      this.clearTimeout()

      // Close EventSource connection
      this.sseClose()

      // Clear console
      this.clearConsole()

      // Wait for transition (and hopefully renderer to be ready)
      await waitFor(500)

      // Update reload counter
      this.updateReloadItems()

      // Reload the page
      window.location.reload(true)
    }
  }
}
</script>
<style lang="less">
.loading-screen {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  .factor-logo-area {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    .app-icon {
      height: 100px;
      min-width: 200px;
    }
  }
}
.loading-area {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100vh;
  transition: opacity 0.4s;
}

h3 {
  font-size: 1.4em;
  font-weight: 700;
  margin: 1em 0;
}

.hasErrors {
  color: #ff0076;
}

.errorStack {
  padding: 1.5em;
  border: 1px solid #0471ff;
  border-radius: 1em;
  background-color: #f6fafd;
  margin: 1em 0;
}

p.pre {
  margin-top: 1em;
  line-height: 1.2em;
  white-space: pre;
}

h4 {
  margin-bottom: 30px;
  font-size: 15px;
  color: #383838;
}

.reload-prevented {
  width: 500px;
  max-width: 85vw;
  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }
}

.progress-bar-wrap {
  .progress-bar-container {
    background-color: #f6fafd;

    border-radius: 1rem;
    width: 500px;
    max-width: 85vw;
    height: 1rem;
    margin-bottom: 1rem;
  }

  &.environment {
    .progress-bar {
      background-color: var(--color-info, #0471ff);
    }
  }
  &.bundle {
    .progress-bar {
      background-color: #0471ff;
    }
  }

  .progress-bar {
    border-radius: 1rem;
    height: 1rem;
    width: 1rem;
    transition: width 0.4s;
  }
  .progress-title,
  .progress-message {
    font-size: 1.35em;
    font-weight: 600;
    text-align: center;
    letter-spacing: -0.02em;
    margin: 2rem 0;
  }
  .progress-message {
    color: #d7e0e6;
  }

  .progress-bar.modern {
    background-color: #2f495e;
  }
}
</style>
