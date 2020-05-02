<template>
  <div class="el-table">
    <section v-for="(group, i) in groups" :key="i">
      <h2>.</h2>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      groups: [
        {
          title: "Extensions",
          children: [
            {
              title: "Community extensions",
              level: 0,
            },
            {
              title: "Free extensions",
              level: 0,
            },
            {
              title: "Pro extensions",
              level: 10,
            },
            {
              title: "Additional features &amp; settings",
              level: 10,
            },
          ],
        },
        {
          title: "Features",
          children: [
            {
              title: "Core Framework",
              level: 0,
            },
            {
              title: "CMS Dashboard",
              level: 0,
            },
            {
              title: "Pro CMS Dashboard",
              level: 10,
            },
            {
              title: "White Label",
              level: 20,
            },
            {
              title: "Dashboard Themes",
              level: 20,
            },
          ],
        },
        {
          title: "Help &amp; Support",
          children: [
            {
              title: "Community support",
              level: 0,
            },
            {
              title: "Premium technical help and support",
              level: 10,
            },
            {
              title: "Priority support with debugging*",
              level: 20,
            },
          ],
        },
        {
          title: "Other Benefits",
          children: [
            {
              title: "Satisfaction Guaranteed",
              level: 0,
            },
            {
              title: "Support ongoing development",
              level: 10,
            },
            {
              title: "Priority feature requests",
              level: 10,
            },
          ],
        },
      ],
    }
  },
})
</script>
