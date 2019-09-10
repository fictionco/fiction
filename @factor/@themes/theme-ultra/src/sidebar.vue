<template>
  <transition name="fade">
    <div v-if="!_props.mobile || _props.showSidebar" class="sidebar-container">
      <div class="sidebar-title-container">
        <site-brand class="site-brand" />
      </div>
      <nav>
        <template v-for="(item, index) in $setting.get('site.nav')">
          <factor-link
            :key="index"
            :path="item.path"
            class="btn-sidebar"
            :class="[item.target, {'btn-sidebar-selected' : selected === item.path}]"
            @click="sidebarPath(item.path)"
          >
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </nav>
      <!-- <div class="sidebar-buttons-container">
        
        <div v-for="(ele, i) in $setting.get('sidebar.sidebarOptions')" :key="i">
          <a
            class="btn-sidebar"
            :class="[ele.target, {'btn-sidebar-selected' : selected === ele.path}]"
            @click="sidebarPath(ele.path)"
          >
            {{ ele.text }}
            <span :class="{'btn-sidebar-line-selected' : selected === ele.path}" />
          </a>
        </div>
      </div>-->
      <div class="copyright">&copy; Copyright 2019. All Rights are Reserved.</div>
    </div>
  </transition>
</template>

<script>
export default {
  components: {
    "site-brand": () => import("./el/brand")
  },
  props: {
    showSidebar: { type: String, default: () => {} }
  },
  data() {
    return {
      loading: true,
      options: [
        "#homeContainerID",
        "#aboutContainerID",
        "#servicesContainerID",
        "#portfolioContainerID",
        "#newsContainerID",
        "#contactPageContainerID"
      ],
      selected: undefined
    }
  },
  mounted: function() {
    for (const ele of this.options) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            this.selected = `#${entries[0].target.id}`
          }
        },
        { threshold: [0.2] }
      )
      observer.observe(document.querySelector(ele))
    }
  },
  methods: {
    sidebarPath(path) {
      let ele = document.querySelector(path)
      ele.scrollIntoView()
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.sidebar-container {
  position: fixed;
  font-family: var(--font-family-primary);
  display: grid;
  color: #f7f7f7;
  background: linear-gradient(90deg, #732b29 -100%, #101010 100%);
  min-height: 100vh;
  height: auto;
  //max-width: 200px;
  //width: 100%;

  nav {
    display: grid;
    justify-content: center;
  }

  > div:last-child {
    display: flex;
    align-self: end;
    padding: 1rem 2rem;
  }

  .copyright {
    font-size: 0.8rem;
  }

  @media (max-width: 900px) {
    left: -100%;
  }
}
.sidebar-buttons-container {
  align-self: center;
  padding: 2rem;
}
.sidebar-button {
  width: 100%;
}
.sidebar-button-mobile {
  width: 100%;
  display: flex;
  height: 20px;
  margin-left: 40px;
}
.sidebar-button-horizontal {
  margin: 22px 0 0 52px;
}
.btn-sidebar-selected {
  color: #f7f7f7 !important;
  font-weight: bold !important;
}
.btn-sidebar {
  color: #9e9e9e;
  font-size: 1.5em;
  line-height: 1.6;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
}
.btn-sidebar:hover {
  color: #f7f7f7;
}
.btn-sidebar-line-selected {
  position: absolute;
  background: #fa5855;
  width: 50px;
  height: 5px;
  // margin: -15px 0 0 120px;
  right: -64px;
  top: 50%;
}
</style>
