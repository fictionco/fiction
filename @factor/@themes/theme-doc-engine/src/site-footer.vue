<template>
  <div class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <factor-link path="/" class="pin">
          <factor-logo />
        </factor-link>
      </div>
      <div class="footer-col">
        <div>
          <div class="copyright">&copy; Factor by Fiction.com Inc.</div>
          <div class="terms">
            <factor-link path="/terms-of-service">Terms of Service</factor-link>
            <factor-link path="/privacy-policy">Privacy Policy</factor-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.content-footer {
  padding: 0;
  max-width: 960px;
  margin: 3em auto;
  position: relative;
  .content-footer-pad {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0;

    .footer-col {
      &:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
      }

      .menu-header {
        font-weight: 600;
        opacity: 0.3;
        margin-bottom: 0.5rem;
      }
      a {
        font-size: 0.9em;
        color: inherit;
        font-weight: 500;
        line-height: 2em;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.2s;
        margin: 0 0.5em;
        &:hover {
          color: var(--color-primary);
        }
      }
      .copyright,
      .terms {
        font-size: 0.7em;
        text-align: right;
      }
      .copyright {
        padding-bottom: 0.5em;
      }
      .terms {
        opacity: 0.5;
        a {
          display: inline-block;
          padding-left: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .content-footer {
    .content-footer-pad {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding: 0 1em;
      .footer-col {
        padding-bottom: 2em;
        a {
          margin: 0;
        }
        .copyright,
        .terms {
          text-align: right;
          a {
            //display: inline-block;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
