<template>
  <div class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <div class="copyright">Built with Factor by Fiction.com Inc.</div>
        <fiction-pin class="icon" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "fiction-pin": () => import("./el/pin")
  },
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.content-footer {
  padding: 0;
  max-width: 1000px;
  margin: 3em auto;
  position: relative;
  .content-footer-pad {
    margin: 0 auto;
    padding-top: 1.5rem;
    padding-bottom: 1rem;

    .footer-col {
      .copyright {
        font-size: 0.7em;
        text-align: center;
        padding-bottom: 0.5em;
        opacity: 0.5;
      }
      .fiction-pin {
        width: 40px;
        margin: 1em auto 0 auto;
        .pinny {
          width: 40px;
          padding-right: 0;
        }
      }
    }
  }
}
</style>