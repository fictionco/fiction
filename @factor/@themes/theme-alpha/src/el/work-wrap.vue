<template>
  <div class="work-wrap">
    <!-- <el-hero
      :headline="$setting.get('work.headline')"
      :subheadline="$setting.get('work.subheadline')"
      :image="$setting.get('work.heroImage')"
    >
      <template v-slot:hero-content>
        <div
          v-formatted-text="$setting.get('work.content')"
          class="content entry-content"
        />
      </template>
    </el-hero> -->

    <router-view />

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./cta.vue")
  }
}
</script>

<style lang="less">
.work-wrap {
  opacity: 1;
  // max-width: 50rem;
  // margin: 0 auto;
  // padding: 1rem 0;
}
</style>
