<template>
  <div class="sidebarContainer">
    <div class="sidebarTitleContainer">
      <h1 class="sidebarTitle">{{ $setting.get('sidebar.sidebarHeadline') }}</h1>
    </div>
    <div class="sidebarButtonsContainer">
      <div
        v-for="(ele, i) in $setting.get('sidebar.sidebarOptions')"
        :key="i"
        class="sidebarButton"
      >
        <button
          class="btn-sidebar"
          :class="ele.target"
          @click="sidebarPath(ele.path)"
        >{{ ele.text }}</button>
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
        "#portfolioContainerID"
      ]
    };
  },
  mounted: function() {
    for (const ele of this.options) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            this.removeSelector();
            let sidebarOption = document.querySelector(
              `.btn-sidebar.${entries[0].target.id}`
            );
            sidebarOption.classList.add("btn-sidebar-selected");
          }
        },
        { threshold: [0.6] }
      );
      observer.observe(document.querySelector(ele));
    }
  },
  methods: {
    sidebarPath(path) {
      let ele = document.querySelector(path);
      ele.scrollIntoView();
    },
    removeSelector() {
      let selectedOptions = document.querySelectorAll(".btn-sidebar-selected");
      if (selectedOptions.length > 0) {
        for (const ele of selectedOptions) {
          ele.classList.remove("btn-sidebar-selected");
        }
      }
    }
  }
};
</script>

<style scoped>
.sidebarContainer {
  position: fixed;
  font-family: Work Sans;
  display: grid;
  grid-template-rows: 20% 80%;
  color: #f7f7f7;
  background: linear-gradient(304.61deg, #732b29 -122.45%, #111010 97.32%);
  height: 100%;
  width: 20vw;
}
.sidebarTitleContainer {
  width: 100%;
  text-align: center;
}
.sidebarButtonsContainer {
  height: 45vh;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.sidebarButton {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn-sidebar-selected {
  color: #f7f7f7 !important;
  font-weight: bold !important;
}
.btn-sidebar {
  color: #9e9e9e;
  font-size: 1.1vw;
  background-color: transparent;
  border: none;
  outline: none;
}
.btn-sidebar:hover {
  color: #f7f7f7;
}
</style>
