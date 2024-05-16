<script lang="ts" setup>
import { useRender } from 'vue-email'
import { vue } from '../utils/libraries'
import { toMarkdown } from '../utils/markdown'
import EmailStandard from './EmailStandard.vue'
import FictionFooterImg from './img/fiction-email-footer.png'
import FictionIconImg from './img/fiction-icon.png'

  type EmailConfig = InstanceType<typeof EmailStandard>['$props']
const email = vue.ref('')

const ht = `<div>
                <h1>Didn't melt fairer keepsakes since <a href="#">Hobbits</a> elsewhere.</h1>
                <p>Woodlands payment Osgiliath tightening. Barad-dur follow belly comforts tender tough bell? Many that live deserve death. Some that die deserve life. Outwitted teatime grasp defeated before stones reflection corset seen animals Saruman's call?</p>
                <h2>Tad survive ensnare joy mistake courtesy Bagshot Row.</h2>
                <p>Ligulas step drops both? You shall not pass! Tender respectable success Valar impressive unfriendly bloom scraped? Branch hey-diddle-diddle pony trouble'll sleeping during jump Narsil.</p>
                <h3>North valor overflowing sort Iáve mister kingly money?</h3>
                <p>Curse you and all the halflings! Deserted anytime Lake-town burned caves balls. Smoked lthilien forbids Thrain?</p>
                <ul>
                  <li>Adamant.</li>
                  <li>Southfarthing!</li>
                  <li>Witch-king.</li>
                  <li>Precious.</li>
                  <li>Gaffer's!</li>
                </ul>
                <ul>
                  <li>Excuse <a href="#">Hobbits</a> yet survives two cover Undómiel city ablaze.</li>
                  <li>Keepsakes deeper clouds Buckland position 21 lied bicker fountains ashamed.</li>
                  <li>Women rippling cold steps rules Thengel finer.</li>
                  <li>Portents close Havens endured irons hundreds handle refused sister?</li>
                  <li>Harbor Grubbs fellas riddles afar!</li>
                </ul>
                <h3>Narsil enjoying shattered bigger leaderless retrieve dreamed dwarf.</h3>
                <p>Ravens wonder wanted runs me crawl gaining lots faster! Khazad-dum surprise baby season ranks. I bid you all a very fond farewell.</p>
                <ol>
                  <li>Narsil.</li>
                  <li>Elros.</li>
                  <li>Arwen Evenstar.</li>
                  <li>Maggot's?</li>
                  <li>Bagginses?</li>
                </ol>
                <ol>
                  <li>Concerning <a href="#">Hobbits</a> l golf air fifth bell prolonging camp.</li>
                  <li>Grond humble rods nearest mangler.</li>
                  <li>Enormity Lórien merry gravy stayed move.</li>
                  <li>Diversion almost notion furs between fierce laboring Nazgûl ceaselessly parent.</li>
                  <li>Agree ruling um wasteland Bagshot Row expect sleep.</li>
                </ol>
                <h3>Ere answering track forests shards roof!</h3>
                <p>Delay freezes Gollum. Let the Ring-bearer decide. Bagshot Row chokes pole pauses immediately orders taught éored musing three-day? Disease rune repel source fire Goblinses already?</p>

                <h4>Afraid smithy Fellowship debt carven hooks.</h4>
                <p>What about second breakfast? Nags runt near Lindir lock discover level? Andûril breathe waited flatten union.</p>
                <blockquote>
                  You shall be the Fellowship of the Ring.
                </blockquote>
                <h5>Should Shirelings extraordinary spends poison's willing enchantment.</h5>
                <p>I think we should get off the road. Penalty sight splintered Misty Mountain mithril? Unrest lasts rode league bears absence Bracegirdle athletic contract nice parent slowed?</p>
                <pre>Pardon Concerning Hobbits rune goblins? Twitching figure including rightful Thorin's level! Worth tubers threats Hornburg deadliest? Unfold thumping shh wants Homely!</pre>
                <h6>Improve drops absolutely tight deceit potent Treebeard startled!</h6>
                <p>J.R.R. Tolkien 3000 uttered veins <q>roaring winds moaning flaming</q>. Meddle <ins>measure pure</ins> Samwise Gamgee business! <sub>Lied</sub> mistake Proudfoots pon. Instance 80 <dfn>morbid ceremonial plunge</dfn> Anor mad. Questions shells hangs noble Proudfoots <var>throws</var>. <mark>Rampart damage</mark> questions Chubbs 3000 conjurer? Single tempt peasants <strong>Bolg Athelas Mordor Wraiths Azog Undómiel</strong> mangler? <samp>Nori Giants Undómiel Rivendell</samp> spike posts took. Fool's Underhill boarded <cite>vanishing twilight unheard-of</cite>. <abbr>Presence</abbr> Dunland lamb lair. Barricade <sup>didn't</sup> feelings purring vine Morgoth. Distract Giants nearing champion <kbd>T</kbd>. Clothing titles quick bother <em>Arod Gloin Beren</em> troop? Balls crashing bastards <small>arrives precisely rascal</small> stubbornness Snowbourn. Hobbitses rose barren <a>strengths tested mirrors moonlight password</a> center? Remade breaking respect amuse Arod? Vengeance <del>Elessar Wolves</del> posts remain doorway said! <time>Suspects</time> fight Merry hungers locked yelp.</p>
                <hr>
                <dl>
                  <dt>Abandon</dt>
                  <dd>Tact flies disturber thinking hospitality Elros act vest handy ranks.</dd>
                  <dt>Devil</dt>
                  <dd>Boneses spilled Caradhras hungry pace lanterns glory haunted shone forging.</dd>
                  <dd>Unprotected Beorn's fireworks dream journey beacon dwells gnaws key.</dd>
                  <dt>Happened</dt>
                  <dd>Known wanna fifth Bill hell knew she scale.</dd>
                  <dd>Missing vanish taken colleague sway voice tricks 13 Grimbold.</dd>
                  <dd>Thereof skills kingsfoil innocent riding light Thorin Oakenshield won.</dd>
                </dl>
                <figure data-x-image>
                    <img src="https://images.unsplash.com/photo-1641350517309-0da6ea5ac684?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Aerial view of the jungle">
                    <figcaption>Aerial view of the dense jungle canopy.</figcaption>
                </figure>



                <p>The journey was tough but rewarding. <sup>[1]</sup></p>

                <p>Finally, after weeks of searching, Emily stood before the ancient gates of Quivira, her eyes wide with awe and her journal filled with incredible details of her journey.</p>

              </div>`
vue.onMounted(async () => {
  // subject: { type: String, default: undefined },
  // heading: { type: String, default: undefined },
  // subHeading: { type: String, default: undefined },
  // markdown: { type: String, default: undefined },
  // preview: { type: String, default: undefined },
  // actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  // unsubscribeLink: { type: String, default: undefined },
  // mediaSuper: { type: Object as vue.PropType<MediaItem>, default: undefined },
  // mediaFooter: { type: Object as vue.PropType<MediaItem>, default: undefined },

  const confirmEmail: EmailConfig = {
    subject: 'Confirm your email address',
    heading: 'Welcome to Fiction',
    subHeading: 'Please confirm your email address',
    // bodyMarkdown: 'Please confirm your email address by clicking the button below.',
    bodyMarkdown: toMarkdown(ht),
    actions: [
      {
        btn: 'primary',
        name: `Confirm email address &#x2192;`,
        href: '#',
      },
      {
        btn: 'default',
        name: `test`,
        href: '#',
      },
      {
        btn: 'naked',
        name: `Test`,
        href: '#',
      },
    ],
    mediaSuper: {
      media: { url: FictionIconImg },
      name: 'Fiction',
      href: 'https://www.fiction.com',
    },
    mediaFooter: {
      media: { url: FictionFooterImg },
      name: 'Market Yourself with Fiction',
      href: 'https://www.fiction.com',
    },
  }

  const r = await useRender(EmailStandard, {
    props: confirmEmail,
  })
  email.value = r.html
})
</script>

<template>
  <iframe class="h-[100dvh] w-[100dvw]" :srcdoc="email" />
</template>
