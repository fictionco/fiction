<template>
  <div class="home">
    <section class="section is-medium">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-5 has-text-centered has-text-left-tablet">
            <h1 class="title is-1">{{ $setting.get('home.headline') }}</h1>
            <p
              class="subtitle"
            >{{ $setting.get('home.subheadline') }}</p>
            <div class="field buttons">
              <app-link 
                v-for="(action ,i) in $setting.get('home.actions')" 
                :key="i"
                :path="action.path"
                :class="action.class"
                size="medium">{{ action.text }}</app-link>
            </div>
          </div>
          <div class="column is-6 is-offset-1">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1502 965" class="hero-graphic">
              <defs>
                <linearGradient 
                  id="a" 
                  x1="22" 
                  y1="463" 
                  x2="1462" 
                  y2="463"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#34495e" />
                  <stop offset=".53" stop-color="#00bfa3" />
                  <stop offset="1" stop-color="#00c1a5" />
                </linearGradient>
              </defs>
              <g style="isolation:isolate">
                <path d="M1452 54c-84 46-88 126-136 152-52 38-108-2-134 12-118 37-104 206-222 238-118 16-172-102-270-90S562 478 460 590c-80 76-146 26-220 52-128 58-96 168-208 230" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="20" stroke="url(#a)"/>
                <rect x="127.57" y="30.44" width="474.85" height="579.3" rx="40" ry="40" fill="#fff"/>
                <rect x="127.57" y="30.44" width="474.85" height="579.3" rx="40" ry="40" fill="none" stroke="#eaeaea" stroke-miterlimit="10"/>
                <rect x="166.84" y="176.03" width="257.75" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="155.94" width="257.75" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".2"/>
                <rect x="166.84" y="194.21" width="294.53" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="212.4" width="184.46" height="7.13" rx="2.82" ry="2.82" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="449.43" width="257.75" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="467.62" width="294.53" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="485.8" width="184.46" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="192.17" y="514.3" width="65.64" height="7.13" rx="3.3" ry="3.3" fill="#293347" opacity=".1"/>
                <rect x="179.51" y="514.3" width="7.14" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
                <rect x="192.17" y="534.05" width="92.57" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="179.51" y="534.05" width="7.14" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
                <rect x="192.17" y="553.8" width="80.09" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="179.51" y="553.8" width="7.14" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
                <rect x="166.84" y="267.4" width="390.91" height="145.69" rx="5" ry="5" fill="#293347" opacity=".1"/>
                <text transform="translate(168.88 114.64)" opacity=".5" font-size="30" fill="#293347" font-family="Prompt-Bold,Prompt" font-weight="700">
                  <tspan letter-spacing="-.025em">C</tspan><tspan x="19.71" y="0">ontent</tspan>
                </text>
                <rect x="772.78" y="11.06" width="474.85" height="232.92" rx="46.67" ry="46.67" fill="#fff"/>
                <rect x="772.78" y="11.06" width="474.85" height="232.92" rx="46.67" ry="46.67" fill="none" stroke="#eaeaea" stroke-miterlimit="10"/>
                <path d="M1187 100.79h-105.34v36H1187a18 18 0 1 0 0-36zM946.73 100.79h127.8v36h-127.8zM832.1 100.79h107.5v36H832.1a18 18 0 0 1-18-18 18 18 0 0 1 18-18z" fill="#293347" opacity=".1"/>
                <path d="M939.6 100.79H832.1a18 18 0 0 0 0 36h107.5z" fill="#293347" opacity=".1"/>
                <rect x="833.7" y="115.22" width="88.79" height="7.13" rx="3.57" ry="3.57" fill="#fff" opacity=".5"/>
                <rect x="965.16" y="115.22" width="88.79" height="7.13" rx="3.57" ry="3.57" fill="#fff" opacity=".5"/>
                <rect x="1097.62" y="115.22" width="88.79" height="7.13" rx="3.57" ry="3.57" fill="#fff" opacity=".5"/>
                <rect x="812.05" y="156.65" width="257.75" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="812.05" y="174.84" width="294.53" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="812.05" y="193.03" width="184.46" height="7.13" rx="2.82" ry="2.82" fill="#293347" opacity=".1"/>
                <text transform="translate(814.1 73.26)" opacity=".5" font-size="30" fill="#293347" font-family="Prompt-Bold,Prompt" font-weight="700">
                  <tspan letter-spacing="-.115em">T</tspan><tspan x="14.31" y="0">a</tspan><tspan x="32.1" y="0" letter-spacing="-.015em">b</tspan><tspan x="51.6" y="0">s</tspan>
                </text>
                <rect x="967.59" y="377.46" width="474.85" height="171.09" rx="40" ry="40" fill="#fff"/>
                <rect x="967.59" y="377.46" width="474.85" height="171.09" rx="40" ry="40" fill="none" stroke="#eaeaea" stroke-miterlimit="10"/>
                <path d="M1147.36 469.21h115a2 2 0 0 1 2 2v31a3 3 0 0 1-3 3h-114a3 3 0 0 1-3-3v-30a3 3 0 0 1 3-3z" fill="#293347" opacity=".09"/>
                <path d="M1163 483.64h83.79a2 2 0 0 1 2 2v2.13a3 3 0 0 1-3 3H1163a3 3 0 0 1-3-3v-1.13a3 3 0 0 1 3-3z" fill="#fff" opacity=".5"/>
                <path d="M1282.82 469.21h115a2 2 0 0 1 2 2v31a3 3 0 0 1-3 3h-114a3 3 0 0 1-3-3v-30a3 3 0 0 1 3-3z" fill="#293347" opacity=".09"/>
                <path d="M1298.43 483.64h83.79a2 2 0 0 1 2 2v2.13a3 3 0 0 1-3 3h-82.79a3 3 0 0 1-3-3v-1.13a3 3 0 0 1 3-3z" fill="#fff" opacity=".5"/>
                <rect x="1008.91" y="469.21" width="120" height="36" rx="3" ry="3" fill="#293347" opacity=".1"/>
                <rect x="1024.51" y="483.64" width="88.79" height="7.13" rx="3.57" ry="3.57" fill="#fff" opacity=".5"/>
                <text transform="translate(1008.91 440.53)" opacity=".5" font-size="30" fill="#293347" font-family="Prompt-Bold,Prompt" font-weight="700">
                  Bu<tspan x="38.52" y="0" letter-spacing="-.025em">t</tspan><tspan x="49.35" y="0" letter-spacing="-.005em">t</tspan><tspan x="60.78" y="0">ons</tspan>
                </text>
                <rect x="654.06" y="623.93" width="474.85" height="211.32" rx="44.46" ry="44.46" fill="#fff"/>
                <rect x="654.06" y="623.93" width="474.85" height="211.32" rx="44.46" ry="44.46" fill="none" stroke="#eaeaea" stroke-miterlimit="10"/>
                <rect x="695.21" y="716.96" width="80" height="80" rx="3.65" ry="3.65" fill="#293347" opacity=".1"/>
                <text transform="translate(695.54 688.62)" opacity=".5" font-size="30" fill="#293347" font-family="Prompt-Bold,Prompt" font-weight="700">
                  Media
                </text>
                <rect x="797.28" y="766.86" width="236.33" height="7.13" rx="3.42" ry="3.42" fill="#293347" opacity=".1"/>
                <rect x="797.28" y="746.77" width="285.75" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".1"/>
                <rect x="797.28" y="726.02" width="101.68" height="7.13" rx="3.57" ry="3.57" fill="#293347" opacity=".2"/>
                <rect x="797.61" y="785.56" width="7.13" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
                <rect x="812.36" y="785.56" width="7.13" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
                <rect x="826.98" y="785.56" width="7.13" height="7.14" rx="3.38" ry="3.38" fill="#293347" opacity=".1"/>
              </g>
            </svg>

          </div>
        </div>
      </div>
    </section>

    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered is-mobile has-text-centered level is-variable is-8 logos">
            <div class="column">
              <figure class="image">
                <img :src="require(`./img/github.svg`)" alt="Github">
              </figure>
            </div>
            <div class="column">
              <figure class="image">
                <img :src="require(`./img/algolia.svg`)" alt="Algolia">
              </figure>
            </div>
            <div class="column">
              <figure class="image">
                <img :src="require(`./img/vue.svg`)" alt="Vue.js">
              </figure>
            </div>
            <div class="column">
              <img :src="require(`./img/nodejs.svg`)" alt="Node JS">
            </div>
            <div class="column">
              <img :src="require(`./img/npm.svg`)" alt="NPM">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section is-medium">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-three-fifths mb-4 has-text-centered">
            <h1 class="title is-3">{{ $setting.get('home.boxesHeadline') }}</h1>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="columns is-multiline is-mobile">

          <div v-for="(box ,i) in $setting.get('home.boxes')" :key="i" class="column is-half">
            <div class="box is-fullheight">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48 is-4by3">
                    <img :src="require(`./img/` + box.imageURL)" :alt="box.title">
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    {{box.logo}}
                    <h3 class="title is-4 mb-2">{{ box.title }}</h3>
                    <p>{{ box.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: this.$setting.get("home.meta.title"),
      description: this.$setting.get("home.meta.description")
    }
  }
}
</script>
<style lang="less">
.home {
  .hero-graphic{
    filter: drop-shadow( 15px 15px 10px rgba(0, 0, 0, .1));
  }
  .subtitle {
    opacity: 0.5;
  }
  .logos .image img {
    max-height: 80px;
  }
}
</style>
