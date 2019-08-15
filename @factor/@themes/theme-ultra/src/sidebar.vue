<template>
  <div class="sidebar-container">
    <div class="sidebar-title-container">
      <h1 class="sidebar-title">{{ $setting.get('sidebar.sidebarHeadline') }}</h1>
    </div>
    <div class="sidebar-buttons-container">
      <div
        v-for="(ele, i) in $setting.get('sidebar.sidebarOptions')"
        :key="i"
        class="sidebar-button"
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
</template>

<script>
/* eslint-disable */
export default {
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
        { threshold: [0.3] }
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

<style scoped>
.sidebar-container {
  position: fixed;
  font-family: Work Sans;
  display: grid;
  grid-template-rows: 5% 95%;
  color: #f7f7f7;
  background: linear-gradient(304.61deg, #732b29 -122.45%, #111010 97.32%);
  height: 100%;
  width: 20vw;
}
.sidebar-title-container {
  width: 100%;
  text-align: center;
}
.sidebar-title {
  font-size: 3em;
}
.sidebar-buttons-container {
  height: 34vh;
  display: flex;
  align-self: center;
  flex-wrap: wrap;
}
.sidebar-button {
  width: 100%;
  display: flex;
  height: 20px;
  margin-left: 32%;
}
.btn-sidebar-selected {
  color: #f7f7f7 !important;
  font-weight: bold !important;
}
.btn-sidebar {
  color: #9e9e9e;
  font-size: 1.5em;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: none;
}
.btn-sidebar:hover {
  color: #f7f7f7;
}
.btn-sidebar-line-selected {
  position: absolute;
  background: #fa5855;
  width: 50px;
  height: 5px;
  margin: -15px 0 0 120px;
}
</style>
