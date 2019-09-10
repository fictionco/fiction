<template>
  <transition name="fade">
    <div v-if="!_props.mobile || _props.showSidebar" class="sidebar-container">
      <div class="sidebar-title-container">
        <site-brand class="site-brand" />
      </div>
      <div
        class="sidebar-buttons-container"
        :class="(_props.mobile && _props.orientationH) ? 'sidebar-button-container-horizontal' : ''"
      >
        <div
          v-for="(ele, i) in $setting.get('sidebar.sidebarOptions')"
          :key="i"
          :class="[!_props.mobile ? 'sidebar-button' : 'sidebar-button-mobile', (_props.mobile && _props.orientationH) ? 'sidebar-button-horizontal' : '']"
        >
          <a
            class="btn-sidebar"
            :class="[ele.target, {'btn-sidebar-selected' : selected === ele.path}]"
            @click="sidebarPath(ele.path)"
          >
            {{ ele.text }}
            <span :class="{'btn-sidebar-line-selected' : selected === ele.path}" />
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
export default {
  components: {
    "site-brand": () => import("./el/brand")
  },
  props: ["mobile", "orientation-h", "show-sidebar"],
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
    };
  },
  mounted: function() {
    for (const ele of this.options) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            this.selected = `#${entries[0].target.id}`;
          }
        },
        { threshold: [0.2] }
      );
      observer.observe(document.querySelector(ele));
    }
  },
  methods: {
    sidebarPath(path) {
      let ele = document.querySelector(path);
      ele.scrollIntoView();
    }
  }
};
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
  grid-template-rows: 5% 95%;
  color: #f7f7f7;
  background: linear-gradient(90deg, #732b29 -122.45%, #231515 97.32%);
  min-height: 100vh;
  height: auto;
  width: 20vw;
}
// .sidebar-title-container {
//   width: 100%;
//   text-align: center;
// }
// .sidebar-title-mobile {
//   font-size: 3em;
//   margin-left: 50px;
// }
// .sidebar-title {
//   font-size: 3em;
// }
.sidebar-buttons-container {
  height: 34vh;
  display: flex;
  align-self: center;
  flex-wrap: wrap;
}
.sidebar-button-container-horizontal {
  height: 58vh;
}
.sidebar-button {
  width: 100%;
  margin-left: 32%;
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
  left: 120%;
  top: 50%;
}
</style>
