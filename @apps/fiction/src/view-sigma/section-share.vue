<template>
  <section class="big-section sigma-share">
    <image-pattern pattern="sprinkles"></image-pattern>

    <div class="mast split-feature">
      <article class="feature-content">
        <figure class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <path
              fill="#A78CE9"
              d="M36-.008c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36z"
            ></path>
            <path
              fill="#573E8E"
              d="M43 57.5v2a1.5 1.5 0 0 1-1.5 1.5H10.117a36.196 36.196 0 0 1-4.046-5H41.5a1.5 1.5 0 0 1 1.5 1.5zm7.345-11.96l-6.18-5.91-9.83 5.37H41.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H24.678c-.1.002-.198.01-.294 0H2.827a35.8 35.8 0 0 1-1.69-5H26.23l5.812-6H.135A36.053 36.053 0 0 1 0 35.992c0-.67.02-1.332.057-1.992h36.828l.67-.69L32.002 28H.9c.39-1.717.902-3.386 1.527-5H41.5c.65 0 1.19.42 1.4.998h8.542c.857 0 1.552.664 1.552 1.483v19.01c0 1.323-1.67 1.985-2.65 1.05zM43 13.5v2a1.5 1.5 0 0 1-1.5 1.5H5.42a36.076 36.076 0 0 1 3.747-5H41.5a1.5 1.5 0 0 1 1.5 1.5z"
            ></path>
            <path
              fill="#FFF"
              d="M52.23 40.498l-6.626-6.624-19.008 13.82c-1.522 1.106-3.416-.787-2.308-2.31l13.823-19-6.623-6.624c-1.02-1.02-.298-2.763 1.145-2.763h20.745c.894 0 1.62.725 1.62 1.62v20.736c0 1.442-1.745 2.164-2.765 1.145z"
            ></path>
          </svg>
        </figure>

        <h1 class=" common-sectiontitle">Save and share queries with your team</h1>

        <p class="common-medium-bodytext">
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
              <pre class="sigma-query-code query"><code>with calendar_days as (
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
    "image-pattern": () => import("./el-image-pattern")
  },
  methods: {}
}
</script>
<style lang="less">
.sigma-share {
  background: #e6ebf1;
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
              0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
            transition: transform 1.2s;
            will-change: transform;

            &:first-child {
              margin-right: 40px;
              background: #8f6ed5;
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
