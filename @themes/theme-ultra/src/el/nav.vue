<template>
  <nav ref="scrollnav-wrapper" class="scrollnav">
    <slot />
  </nav>
</template>

<script>
  export default {
    props: {
      activeClass: { type: String, default: 'is-active' },
    },
    data() {
      return {
        observer: null,
        items: [],
        currentItem: null,
        lastActiveItem: null,
        scrollAnimationFrame: null
      }
    },
    computed: {
      scrollContainer() {
        const container = window
        return container
      },
    },
    mounted() {
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

      if (!this.observer) {
        // Watch for DOM changes in the scrollnav element wrapper
        this.observer = new MutationObserver(this.initScrollactiveItems)
        this.observer.observe(this.$refs['scrollnav-wrapper'], {
          childList: true,
          subtree: true,
        })
      }

      this.initScrollactiveItems()
      this.removeActiveClass()
      this.currentItem = this.getItemInsideWindow()

      if (this.currentItem) this.currentItem.classList.add(this.activeClass)

      this.scrollToHashElement()
      this.scrollContainer.addEventListener('scroll', this.onScroll)
    },
    updated() {
      this.initScrollactiveItems()
    },
    beforeDestroy() {
      this.scrollContainer.removeEventListener('scroll', this.onScroll)
      window.cancelAnimationFrame(this.scrollAnimationFrame)
    },
    methods: {
      onScroll(event) {
        this.currentItem = this.getItemInsideWindow()

        if (this.currentItem !== this.lastActiveItem) {
          this.removeActiveClass()
          this.$emit('itemchanged', event, this.currentItem, this.lastActiveItem)
          this.lastActiveItem = this.currentItem
        }

        //if (this.currentItem) this.pushHashToUrl(this.currentItem)

        // Current item might be null if not inside any section
        if (this.currentItem) this.currentItem.classList.add(this.activeClass)
      },
      getItemInsideWindow() {
        let currentItem;

        // Must be called with 'call' to prevent bugs on some devices
        [].forEach.call(this.items, (item) => {

          const target = document.querySelector('#' + decodeURI(item.hash.slice(1)))

          if (!target) return

          const distanceFromTop = this.scrollContainer.scrollTop || window.pageYOffset
          const isScreenPastSection = distanceFromTop >= this.getOffsetTop(target)

          if (isScreenPastSection) currentItem = item
        })

        return currentItem
      },
      initScrollactiveItems() {
        this.items = this.$el.querySelectorAll('.active-item')
      },
      handleClick(event) {
        event.preventDefault()

        const { hash } = event.currentTarget

        this.pushHashToUrl(hash)

        const target = document.querySelector('#' + decodeURI(hash.slice(1)))

        /**  Temporarily removes the scroll listener and the request animation frame so the active
         *  class will only be applied to the clicked element, and not all elements while the window is scrolling **/

        this.scrollTo(target)
          .then(() => {
            this.pushHashToUrl(hash)
          })
      },
      getOffsetTop(element) {
        let yPosition = 0
        let nextElement = element

        while (nextElement) {
          yPosition += (nextElement.offsetTop)
          nextElement = nextElement.offsetParent
        }

        if (this.scrollContainer.offsetTop) {
          yPosition -= this.scrollContainer.offsetTop
        }

        return yPosition
      },
      removeActiveClass() {
        // Must be called with 'call' to prevent bugs on some devices
        [].forEach.call(this.items, (item) => {
          item.classList.remove(this.activeClass)
        })
      },
      scrollToHashElement() {
        const { hash } = window.location
        if (!hash) return

        const hashElement = document.querySelector(decodeURI(hash))
        if (!hashElement) return

        // Clears the hash to prevent scroll from jumping
        window.location.hash = ''

        setTimeout(() => {
          const yPos = hashElement.offsetTop

          this.scrollContainer.scrollTo(0, yPos)

          this.pushHashToUrl(hash)
        }, 0)
      },
      pushHashToUrl(hash) {
        if (window.history.pushState) {
          window.history.pushState(null, null, hash)

          return
        }

        window.location.hash = hash
      },
    },
  }
</script>
