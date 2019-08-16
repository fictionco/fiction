<template>
  <section class="big-section sigma-share">
    <div class="mast split-feature">
      <article class="feature-content">
        <home-icon icon="ssr" />
        <h1 class="section-title">Drop-In Plugins and Beautiful Themes</h1>

        <p class="medium-body-text">
          Save frequently-used queries to run them again at any time or share a link to a
          useful query so that any of your teammates can use it too.
        </p>
      </article>

      <figure class="feature-figure">
        <div class="share-animation">
          <ul class="conversation active">
            <li>
              <p>Can you remind me how we calculate monthly recurring revenue?</p>
            </li>
            <li>
              <pre class="query"><code>with calendar_days as (
  select
  day
  54 lines hidden
  cast (captured_amount/customer_count as decimal(32, 2)) as ARPU
from monthly_summary
order by 1 desc, 2</code></pre>

              <p>
                Here’s the full query:
                <a>https://dashboard.stripe.com/query/j834rvj911</a>
              </p>
            </li>
          </ul>
        </div>
      </figure>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue"),
    "image-pattern": () => import("./el-image-pattern")
  },
  methods: {}
}
</script>
<style lang="less">
.sigma-share {
  margin-bottom: -660px;
  overflow: hidden;
  position: relative;
  padding: 180px 0;
  padding-bottom: 700px;
  @media (max-width: 767px) {
    padding-bottom: 650px;
  }
  .pattern {
    position: absolute;
    top: 200px;
    left: calc(50% + 280px);
    bottom: -200px;
    @media (max-width: 767px) {
      top: auto;
      left: calc(50% - 600px);
    }
  }
  .split-feature {
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-content {
      .icon {
        width: 72px;
        height: 72px;
        margin: -15px 0 20px -5px;
      }
    }
    .feature-figure {
      display: flex;
      justify-content: flex-end;
      width: auto;
      margin-top: 0;
      padding-left: 60px;
      @media (max-width: 767px) {
        padding-left: 0;
        margin-top: 60px;
      }
      .share-animation {
        height: 450px;
        max-width: 450px;
        position: relative;
        z-index: 20;
        flex-grow: 1;
        @media (max-width: 767px) {
          margin: 0 auto;
        }

        .conversation {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 50%;
          right: 0;
          left: 0;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 1.2s;
          will-change: opacity;
          pointer-events: none;
          list-style: none;
          &.active {
            opacity: 1;
            transition-delay: 0.5;
          }
          li {
            position: relative;
            font-size: 20px;
            line-height: 30px;
            border-radius: 10px;
            box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
              0 18px 36px -18px rgba(0, 0, 0, 0.3),
              0 -12px 36px -8px rgba(0, 0, 0, 0.025);
            transition: transform 1.2s;
            will-change: transform;

            &:first-child {
              margin-right: 40px;
              background: var(--color-primary);
              color: #fff;
              transform-origin: 50% 100%;
            }
            &:nth-child(2) {
              margin-left: 40px;
              background: #f6f9fc !important;
              color: #525f7f;
              position: relative;
              transform-origin: 50% 0;
            }
            p {
              padding: 20px 25px;
            }
            pre {
              position: relative;
              border-radius: 10px 10px 0 0;
              overflow: hidden;
              padding: 20px 25px;
              font-size: 13px;
              line-height: 23px;
              color: #6f7c82;
              background: #fff;
              &:after {
                content: "";
                position: absolute;
                pointer-events: none;
                top: 0;
                right: 0;
                bottom: 0;
                width: 40px;
                background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff);
              }
            }
            a {
              font-weight: 500;
              border-bottom: 2px solid rgba(103, 114, 229, 0.3);
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 3px;
              color: #6772e5;
            }
          }
          li + li {
            margin-top: 30px;
          }
        }
      }
    }
  }
}
</style>
