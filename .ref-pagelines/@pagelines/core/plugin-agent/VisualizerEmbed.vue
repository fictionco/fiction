<script setup lang="ts">
import type { FactorRouter } from '@factor/api'
import { useService, vue } from '@factor/api'
import { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import { setup as embedTagSetup } from '../plugin-embed/tag'
import type { AgentOptions } from '../tables'
import type { PostMessageAgent } from './obj'
import { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

const { factorRouter, pageLinesAgent } = useService<{
  pageLinesAgent: PageLinesAgent
  factorRouter: FactorRouter
}>()
const loading = vue.ref(true)

const agent = vue.shallowRef<ChatAgent>()

const agentId = vue.computed(() => {
  return (factorRouter.params.value.agentId as string) || ''
})

const opts = vue.computed(() => {
  // decode entities
  const obj = factorRouter.query.value as Record<string, string>
  const urlConfig = Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [k, decodeURIComponent(v)])
      .filter(([_k, v]) => v),
  )

  const out = {
    ...agent.value?.options.value,
    ...urlConfig,
  } as Partial<AgentOptions>

  return out
})

/**
 * This is passed via tag in production
 */
async function requestAgent() {
  const a = agentId.value

  if (a) {
    const r = await pageLinesAgent.findOne({ agentId: a })

    if (r)
      return r
  }
}
vue.onMounted(async () => {
  agent.value = await requestAgent()

  const tag = await embedTagSetup({
    organization: { organizationId: 'example' },
    agentBaseUrl: pageLinesAgent.editEmbedUrl.value,
    agents: [agent.value?.toConfig()],
  })

  await tag.init()
  loading.value = false

  // Define the original function
  const updateAgent = async () => {
    tag.agents = [agent.value?.toConfig()]
    await tag.init()
  }

  new FrameUtility<PostMessageAgent>({
    relation: 'child',
    onMessage: async (e) => {
      if (e.messageType === 'setAgent') {
        agent.value = new ChatAgent({ pageLinesAgent, ...e.data })

        await updateAgent()
      }
    },
  }).init()
})
</script>

<template>
  <div id="preview" class="text-theme-800 font-brand px-3 md:px-7">
    <div class="article-viewport">
      <article class="px-4 pb-12 pt-16">
        <span
          class="title md:mt-18 mx-auto mb-12 mt-8 text-4xl md:mb-24 md:text-6xl"
        >
          Alice's Adventure in Wonderland
          <span class="author">by Lewis Carroll</span>
        </span>

        <span class="chaper">Chapter 1</span>
        <span class="chaper-name">Down the Rabbit-Hole</span>

        <p>
          Alice was beginning to get very tired of sitting by her sister on the
          bank, and of having nothing to do. Once or twice she had peeped into
          the book her sister was reading, but it had no pictures or
          conversations in it, “and what is the use of a book,” thought Alice,
          “without pictures or conversations?”
        </p>

        <p :class="opts.trigger === 'click' ? 'block' : 'hidden'">
          <button
            type="button"
            class="bg-primary-600 hover:bg-primary-700 inline-flex items-center rounded-xl border border-transparent px-6 py-3 text-base font-semibold text-white shadow-lg"
            :data-pl-agent-id="agentId"
            :data-pl-trigger="opts.trigger"
            :data-pl-mode="opts.mode"
            :data-pl-position="opts.position"
          >
            Activate PageLines
          </button>
        </p>

        <p>
          So she was considering in her own mind (as well as she could, for the
          day made her feel very sleepy and stupid), whether the pleasure of
          making a daisy-chain would be worth the trouble of getting up and
          picking the daisies, when suddenly a White Rabbit with pink eyes ran
          close by her.
        </p>

        <img
          src="./img/white-rabbit.png"
          width="260"
          height="395"
          loading="lazy"
          alt="Illustration by Sir John Tenniel showing the White Rabbit looking at his watch and exclaiming 'Oh dear! Oh dear! I shall be too late!' before it popped down a large rabbit-hole."
        >

        <p>
          There was nothing so very remarkable in that, nor did Alice think it
          so very much out of the way to hear the Rabbit say to itself, “Oh
          dear! Oh dear! I shall be too late!” But when the Rabbit actually took
          a watch out of its waistcoat-pocket and looked at it and then hurried
          on, Alice started to her feet, for it flashed across her mind that she
          had never before seen a rabbit with either a waistcoat-pocket, or a
          watch to take out of it, and, burning with curiosity, she ran across
          the field after it and was just in time to see it pop down a large
          rabbit-hole, under the hedge. In another moment, down went Alice after
          it!
        </p>

        <p>
          The rabbit-hole went straight on like a tunnel for some way and then
          dipped suddenly down, so suddenly that Alice had not a moment to think
          about stopping herself before she found herself falling down what
          seemed to be a very deep well.
        </p>

        <p>
          Either the well was very deep, or she fell very slowly, for she had
          plenty of time, as she went down, to look about her. First, she tried
          to make out what she was coming to, but it was too dark to see
          anything; then she looked at the sides of the well and noticed that
          they were filled with cupboards and book-shelves; here and there she
          saw maps and pictures hung upon pegs. She took down a jar from one of
          the shelves as she passed. It was labeled “ORANGE MARMALADE,” but, to
          her great disappointment, it was empty; she did not like to drop the
          jar, so managed to put it into one of the cupboards as she fell past
          it.
        </p>

        <p>
          Down, down, down! Would the fall never come to an end? There was
          nothing else to do, so Alice soon began talking to herself. “Dinah'll
          miss me very much to-night, I should think!” (Dinah was the cat.) “I
          hope they'll remember her saucer of milk at tea-time. Dinah, my dear,
          I wish you were down here with me!” Alice felt that she was dozing
          off, when suddenly, thump! thump! down she came upon a heap of sticks
          and dry leaves, and the fall was over.
        </p>
      </article>
    </div>
  </div>
</template>

<style lang="less" scoped>
@color_1: inherit;
@color_2: #000;
@color_3: #202020;
@color_4: #fff;
@color_5: #808080;
@color_6: #707070;
@color_7: #505050;
@color_8: #1e293b;
@color_9: #dc2626;
@color_10: #265997;
@color_11: #ccc;
@font_family_1: system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
  "Segoe UI Symbol", "Noto Color Emoji";
@font_family_2: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo,
  monospace;
@font_family_3: inherit;
@font_family_4: system-ui, sans-serif;
@font_family_5: Charter, "Bitstream Charter", "Sitka Text", Cambria, serif;
@font_family_6: "Cascadia Code", Menlo, Consolas, "DejaVu Sans Mono", monospace;
@font_family_7: "Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052,
  serif;
@font_family_8: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
  source-sans-pro, sans-serif;
@font_family_9: Avenir, Montserrat, Corbel, "URW Gothic", source-sans-pro,
  sans-serif;
@font_family_10: Optima, Candara, "Noto Sans", sans-serif;
@font_family_11: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans",
  Arial, sans-serif;
@font_family_12: "Nimbus Mono PS", "Courier New", monospace;
@font_family_13: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo,
  Consolas, "DejaVu Sans Mono", monospace;
@font_family_14: Bahnschrift, "DIN Alternate", "Franklin Gothic Medium",
  "Nimbus Sans Narrow", sans-serif-condensed, sans-serif;
@font_family_15: ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa,
  Manjari, "Arial Rounded MT", "Arial Rounded MT Bold", Calibri, source-sans-pro,
  sans-serif;
@font_family_16: Rockwell, "Rockwell Nova", "Roboto Slab", "DejaVu Serif",
  "Sitka Small", serif;
@font_family_17: Superclarendon, "Bookman Old Style", "Sitka Heading",
  "URW Bookman", "URW Bookman L", "Georgia Pro", Georgia, serif;
@font_family_18: Didot, "Bodoni MT", "Noto Serif Display", "URW Palladio L",
  P052, Sylfaen, serif;
@font_family_19: "Segoe Print", "Bradley Hand", Chilanka, TSCu_Comic, casual,
  cursive;
@border_color_1: inherit;

#article-viewport {
  background: #fff;
  padding-bottom: 3rem;
}
#preview {
  p {
    margin: 0 0 1.5rem;
  }
  .ui {
    max-width: 84rem;
    min-height: 7.5rem;
    summary {
      padding: 1rem 4rem;
      gap: 0.5rem;
    }
  }
  article {
    font-size: 1.25rem;

    .chaper-name {
      font-size: 2rem;
    }
    img {
      margin: 0 -3rem 0 1.5rem;
      float: right;
    }
  }
  .ui {
    list-style: none;
    padding: 0;
    summary {
      &::-webkit-details-marker {
        display: none;
      }
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem;
      gap: 0.75rem;
    }
    button {
      appearance: none;
      flex: 1 auto;
      background: transparent;
      color: @color_11;
      font-size: 1.125rem;
      line-height: 1.1;
      min-height: 1.5rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      padding: 0.5rem;
      margin: 0;
      vertical-align: top;
      cursor: pointer;
      position: relative;
    }
  }
  button {
    &:active {
      top: 1px;
    }
  }
  button[data-on="true"] {
    border: 2px solid rgba(255, 255, 255, 1);
    color: @color_4;
  }
  article {
    font-size: 1.125rem;
    line-height: 1.7777778;
    max-width: 47rem;
    margin: 0 auto;

    .title {
      display: block;

      max-width: 32rem;
      line-height: 1.1;
      text-align: center;
      font-weight: 200;
    }
    .author {
      display: block;
      font-size: 1.25rem;
      margin: 1rem auto;
      max-width: 32rem;
      line-height: 1.1;
      text-align: center;
      font-weight: 400;
      font-style: italic;
    }
    img {
      display: block;
      margin: 0 auto;
    }
    .chaper {
      display: block;
      font-size: 1rem;
      line-height: 1;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
    .chaper-name {
      display: block;
      margin: 0.75rem 0 1rem;
      font-size: 1.75rem;
      line-height: 1.1;
      text-align: center;
      font-weight: 600;
    }
    p {
      &:first-of-type {
        &::first-letter {
          font-size: 225%;
          line-height: 1;
          margin-right: 0.1rem;
        }
      }
    }
  }
}
h2#characters {
  scroll-margin-top: 7.45rem;
}
#font-characters {
  max-width: 84rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  content-visibility: auto;
  min-height: 150vh;
}
.character-set {
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.15);
  h3 {
    font-family: @font_family_4;
    font-weight: 500;
    padding: 1rem;
    background: #eee;
    margin: 3rem 0 0;
    border: 1px solid #888;
    width: calc(100% + 1px);
    margin-left: -1px;
  }
  &:first-child {
    h3 {
      margin-top: 0;
    }
  }
  div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
    text-align: center;
    font-size: 1.75rem;
    line-height: 1;
    background: #f5f5f5;
  }
  i {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: normal;
    background: #fff;
    border: 1px solid #888;
    margin: -1px 0 0 -1px;
  }
}
.system-ui {
  font-family: @font_family_4;
}
.transitional {
  font-family: @font_family_5;
}
.old-style {
  font-family: @font_family_7;
}
.humanist {
  font-family: @font_family_8;
}
.geometric-humanist {
  font-family: @font_family_9;
}
.classical-humanist {
  font-family: @font_family_10;
}
.neo-grotesque {
  font-family: @font_family_11;
}
.monospace-slab-serif {
  font-family: @font_family_12;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}
.monospace-code {
  font-family: @font_family_13;
}
.industrial {
  font-family: @font_family_14;
}
.rounded-sans {
  font-family: @font_family_15;
}
.slab-serif {
  font-family: @font_family_16;
}
.antique {
  font-family: @font_family_17;
}
.didone {
  font-family: @font_family_18;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}
.handwritten {
  font-family: @font_family_19;
}
footer {
  padding: 2rem 1rem 2.25rem;
  background: #252525;
  color: @color_11;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  a {
    color: @color_1;
    text-decoration-color: #aaa;
    text-decoration-thickness: 1px;
  }
  span {
    padding: 0 0.5rem;
    opacity: 0.5;
  }
}
@media (hover: hover) {
  a {
    &:hover {
      text-decoration-color: #000;
    }
  }
  #menu {
    nav {
      a {
        &:hover {
          color: @color_3;
          text-decoration: underline;
        }
      }
    }
  }
  header {
    .logo-link {
      &:hover {
        text-decoration-color: #ddd;
        .logo-front-layer {
          transform: translate(-2px, -1px);
        }
        .logo-middle-layer {
          transform: translate(2px, 1px);
        }
        .logo-back-layer {
          transform: translate(6px, 3px);
        }
      }
    }
  }
  .btn {
    &:hover {
      border: 2px solid #aaa;
    }
  }
  .font-link {
    &:hover {
      color: @color_2;
    }
  }
  .font-title {
    &:hover {
      .font-link {
        display: inline-flex;
      }
    }
  }
  footer {
    a {
      &:hover {
        color: @color_1;
        text-decoration-color: #fff;
      }
    }
  }
}
@media (hover: none) {
  .font-title {
    .font-link {
      display: inline-flex;
    }
  }
}
@media (min-width: 42rem) {
  header {
    h2 {
      font-size: 1.25rem;
      font-weight: 500;
    }
    p {
      font-size: 1.125rem;
    }
  }
  #menu {
    details {
      position: fixed;
    }
  }
  section {
    > h2 {
      padding: 1.5rem 1rem;
    }
  }
  .ui {
    min-height: 4.5rem;
    padding: 0 4rem;
  }
  #preview-text {
    width: auto;
    padding: 0.75rem;
    margin-left: 1rem;
    align-self: center;
    border: 2px solid #404040;
  }
  #fonts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
    gap: 0 1.5rem;
    padding: 3rem 1.5rem 4rem;
  }
  .font-title {
    padding: 1.25rem 1rem;
  }
  .font-preview {
    padding: 1.5rem 1rem;
  }
  .font-weights {
    font-size: 1rem;
    padding: 1rem;
  }
  .font-stack {
    padding: 0.5rem 1rem 0.75rem;
  }
  .character-set {
    div {
      grid-template-columns: repeat(auto-fill, minmax(3.75rem, 1fr));
      font-size: 1.5rem;
    }
    span {
      height: 3.75rem;
    }
  }
}

@media (max-width: 42rem) {
  #preview {
    .ui {
      button {
        display: none;
      }
    }
    button[data-on="true"] {
      display: block !important;
      pointer-events: none;
      &:after {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23fff' width='24' height='24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9' /%3E%3C/svg%3E%0A");
        position: absolute;
        right: 6px;
        top: 6px;
      }
    }
    .ui[open] {
      button {
        display: block;
      }
      button[data-on="true"] {
        &:after {
          content: none;
        }
      }
    }
  }
}
@media (pointer: coarse) {
  .ui {
    div {
      input {
        &::-webkit-slider-thumb {
          width: 0.25rem;
          height: 2.75rem;
          background: linear-gradient(
            90deg,
            #fff0 0%,
            #fff0 47%,
            #fff 47%,
            #fff 53%,
            #fff0 53%,
            #fff0 100%
          );
          transform: scaleX(12);
          box-shadow: none;
          border-top: 0.75rem solid #000;
          border-bottom: 0.75rem solid #000;
        }
        &::-moz-range-thumb {
          width: 0.25rem;
          height: 2.75rem;
          background: linear-gradient(
            90deg,
            #fff0 0%,
            #fff0 47%,
            #fff 47%,
            #fff 53%,
            #fff0 53%,
            #fff0 100%
          );
          transform: scaleX(12);
          box-shadow: none;
          border-top: 0.75rem solid #000;
          border-bottom: 0.75rem solid #000;
        }
      }
    }
  }
}
</style>
