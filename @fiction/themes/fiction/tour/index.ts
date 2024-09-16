import type { getFactory } from '../index.js'

export async function getPage(args: { factory: Awaited<ReturnType<typeof getFactory>> }) {
  const { factory } = args
  return factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'tour',
    title: 'Tour',
    cards: [
      await factory.create({
        templateId: 'area',
        cards: [
          await factory.create({
            templateId: 'hero',
            userConfig: {
              superColor: 'green',
              superIcon: { iconId: 'arrow-up-right' },
              superHeading: 'Why Fiction',
              subHeading: `Fiction is the easiest way to market yourself online.`,
              heading: `Are you ready to be seen and to <span data-text-effect data-effect-type="squiggle" data-effect-color="primary">make your impact?</span>`,
              actions: [
                {
                  name: 'I Am Ready',
                  href: '/app/login?_reload=1',
                  theme: 'primary',
                  design: 'solid',
                  iconAfter: 'i-tabler-arrow-big-right-lines',
                },
              ],
            },
          }),
          await factory.create({
            templateId: 'logos',
            userConfig: {
              layout: 'stacked',
              items: [
                {
                  name: 'Coke',
                  href: 'https://www.nytimes.com/2022/10/21/technology/generative-ai.html',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-29.999685 -16.372025 259.99727 98.23215"><path d="M167.1059 55.846c-.003 0-.6185.5488-.6185.5488-.8795.7863-1.7845 1.628-2.877 1.207-.3018-.1097-.514-.5117-.565-.8237-.0497-2.2505.9637-4.3358 1.9465-6.3662l.252-.531c2.827-4.7202 6.113-10.282 10.939-14.142.8132-.5868 1.6958-1.0798 2.6272-.6953.2142.2008.4637.5488.4637.896 0 .1103-.0977.4028-.1542.4938-1.3478 2.1782-2.6315 4.465-3.8798 6.6602-2.4395 4.3365-4.9702 8.8185-8.134 12.753zm-26.149-11.124c-.1847.1288-3.445-.9694-4.075-3.9881-.5345-2.599 1.2552-4.6298 2.9868-5.6535.7432-.5858 1.8628-.7865 2.684-.495.7622.513.9688 1.4285.9688 2.415 0 .605-.0803 1.2265-.151 1.7935l-.0158.1285c-.5432 2.0302-1.3745 4.0248-2.3978 5.7998zm-12.454 12.277c-.3325-.494-.4428-1.0341-.4538-1.6181-.0638-3.5875 3.796-10.012 6.5205-13.512h.006c1.1418 2.5 3.7272 4.107 5.288 4.7842-1.9385 4.3182-8.5868 13.566-11.36 10.346zm47.054.637c-.6453.439-1.5518.1016-1.2128-.9044.8442-2.5615 4.2008-7.7815 4.2008-7.7815l9.349-16.582h-6.404c-.3043.5-.9553 1.6482-.9553 1.6482-.2962-.4935-1.1822-1.591-1.547-1.828-1.5645-.9888-3.86-.5213-5.4435.375-6.8848 4.0258-11.908 11.98-15.87 18.182 0 0-4.1702 6.895-6.4852 7.4078-1.8072.1465-1.6208-2.288-1.5425-2.8552.6988-4.099 2.3215-7.9958 3.9565-11.527 3.3252-2.3052 7.1202-5.324 10.569-8.6355 7.4845-7.1545 13.794-15.26 14.716-17.071 0 0-.9982.2015-2.177.2377-5.758 8.032-17.541 19.706-21.113 21.443 1.5825-3.8062 11.807-21.974 20.508-30.664l1.3693-1.3178c2.117-2.0675 4.3108-4.1898 6.0202-4.5375.1805-.0182.413 0 .6137.4215.0763 1.6098-.523 2.7992-1.2105 4.153l-.9635 1.9763s1.3648-.2562 2.261-.5497c1.04-1.9568 2.1918-4.153 1.7672-6.7688-.1417-.8418-.751-1.482-1.5472-1.6285-2.5955-.494-5.4242 1.4265-7.7002 2.9822l-.092.0545c-11.7 9.1665-21.58 22.377-30.218 40.417-.626.475-3.0448 1.0428-3.456.768.853-1.756 1.927-4.1168 2.4645-6.6782.093-.732.1795-1.4818.1795-2.2135 0-1.5748-.378-3.0562-1.7888-4.0805-1.654-.8235-3.6982-.439-5.0765.1827-6.1745 2.5615-10.789 8.8925-14.119 14.106-1.791 3.3125-3.5768 6.8602-4.0712 10.923-.3483 3.183.3607 5.2322 2.1705 6.2572 1.8612.9508 4.2038-.0375 5.124-.5127 6.2552-3.2932 10.626-9.8978 14.071-15.936.137-.018 2.018-.0725 3.4408-.439.019 0 .027 0 .0585.0192-.0815.2732-.8168 2.4695-.8168 2.4695-2.1835 6.4032-3.1932 10.758-1.1308 13.338 2.9472 3.6412 7.8265-.1275 11.796-5.105-.852 5.9645 2.2392 6.898 4.5955 6.441 2.7068-.7315 5.723-3.623 7.1228-5.1045-.4495 1.7378-.3272 4.8485 2.135 5.1592 1.6878.312 2.9508-.606 4.4122-1.393 5.2422-2.8545 11.518-12.366 13.147-15.116h-2.1362c-2.316 3.5002-5.2632 8.0895-8.9705 10.268zm-80.761-35.518h5.9998l3.3862-5.5h-6.001zm95.841-14.611c-4.5748 2.5986-9.317 4.2814-15.058 3.696-1.591 1.7936-3.14 3.6413-4.5678 5.5439 8.0572 2.0492 16.599-2.5065 21.363-6.8422 5.0395-4.373 7.6238-9.8797 7.6238-9.8797s-3.7775 4.3175-9.3612 7.4822zm-50.45-1.39c-.954 10.941-9.4588 17.364-11.563 17.875-1.2752.2558-3.4512-.311-1.5088-4.9027 2.8608-6.1848 7.7448-11.435 12.985-14.125.1275.4575.1242.7495.0867 1.1525zm-16.572 27.572c-.6093-1.317-2.0558-2.1587-3.5972-2.0674-5.0058.4577-9.902 4.5742-12.473 10.484-1.349 3.0375-2.0852 5.5438-2.568 9.5322 1.5565-1.7925 4.7315-4.738 8.3345-6.3482 0 0 .4902-3.8238 2.9902-7.227.946-1.4092 2.8392-3.6778 4.965-3.0742 1.8572.6225 1.2045 5.7638-1.264 10.739-1.8265 3.6598-4.6215 7.32-7.4495 9.8442-2.5002 2.1225-6.1995 4.6838-9.436 2.708-2.0385-1.207-3.0782-3.7325-2.8585-6.9892.974-9.2392 5.1798-17.107 11.198-26.072 6.206-8.3248 13.047-16.869 22.263-21.426 1.8798-.9513 3.6205-1.1708 5.1252-.5853 0 0-8.651 4.757-12.775 13.558-1.049 2.2325-2.508 5.2505-1.0388 7.922.7677 1.3902 2.131 1.5002 3.2285 1.427 5.0548-1.1712 8.3205-5.8915 10.989-10.209 1.547-3.275 2.922-6.5318 2.922-10.155 0-.439-.0228-1.0242-.06-1.4638 2.415-1.2802 7.367.988 7.367.988 3.8698 1.2812 12.11 7.5938 14.889 8.8008 1.3558-1.5732 3.5838-3.9515 4.8382-5.141l-1.816-1.1162c-2.9075-1.7748-5.9808-3.4582-9.0058-5.123-6.8698-3.7502-12.462-2.4332-15.308-1.4085-1.1185.4023-2.1408.75-2.1408.75-2.112-2.3052-5.5758-2.0862-8.128-1.4637-9.1785 2.6345-17.7 9.0562-26.836 20.199-6.717 8.7275-10.884 16.266-13.104 23.712-1.7118 5.0128-2.232 12.386 1.946 16.759 3.5522 3.713 8.2625 2.9088 11.589 1.5735 7.2068-3.5495 13.684-11.198 16.912-19.998.7788-2.616 1.6432-6.3118.3023-9.1298zm-79.885-8.4887c-.012.0365-1.224 2.8172-1.224 2.8172-.1752.1462-.4522.0733-.7697 0l-.544-.092c-1.7082-.5303-2.9968-1.6648-3.394-3.0185-.548-2.6348 1.7028-4.7022 2.6945-5.452.9515-.6593 2.4308-1.0068 3.2898-.3295.5297.6222.7305 1.427.7305 2.3058.0002 1.189-.3668 2.5245-.783 3.769zm-2.6035 5.287s-.055.1652-.0822.2192c-.007 0-2.755 4.482-2.755 4.482-1.6585 2.2142-3.7292 4.996-6.3178 6.331-.7672.2563-1.8278.4213-2.3682-.2552-1.1458-1.3725-.5552-3.2752-.0755-4.812l.1698-.549c1.3755-3.732 3.558-7.026 5.6822-10.082.0265-.018.086-.0362.1075-.0362.005.0183.0135.0183.0172.055 1.333 2.561 3.8325 3.7498 5.7018 4.2995.0113 0 .0233.0182.0233.055.0002.0545-.0303.1282-.103.2922zm34.376-2.9455c1.2292-1.7012 4.807-6.2572 5.6792-7.0255 2.9335-2.5808 4.106-1.4452 4.2075-.6408-2.7378 4.9032-5.969 10.52-9.007 15.57.006-.018-.9507 1.4452-.9507 1.4452-1.3418 2.0488-2.6928 3.8052-4.8965 5.031-.3143.092-.8323.1288-1.177-.1282-.415-.2745-.5788-.732-.532-1.208.132-1.573 1.7338-6.384 6.6765-13.044zm-30.465-11.124c-3.7925-2.4882-11.415 2.2688-17.52 10.428-5.583 7.3192-7.9938 15.826-5.3702 19.76 3.9028 4.6288 11.148-2.104 14.229-5.7078l.3975-.4213c2.0952-2.2505 3.714-4.9585 5.2808-7.5568 0 0 1.44-2.3785 1.5088-2.4885.89-.164 1.962-.4202 3.17-.768-.0172.0545-4.6218 7.794-4.152 11.636.1463 1.172.0345 5.4532 4.2145 6.752 5.571.9338 10.02-3.3848 13.944-7.227 0 0 .6688-.6397 1.047-1.005a215.179 215.179 0 00-.2205.8945c-1.631 5.672.5675 6.862 1.9428 7.3012 4.1562 1.2082 9.1215-4.83 9.1375-4.83-.1287 1.902-.5052 3.4755 1.4998 4.738 1.8925.6775 3.8078-.3552 5.2635-1.325 5.2438-3.6958 9.4682-9.48 12.88-14.48h-2.1765c-.0257 0-5.3708 7.747-8.8415 9.4308-.005 0-.637.3243-1.001.0677-.4505-.3845-.2727-1.1835.005-1.7495.0175-.037 13.401-23.249 13.401-23.249h-6.319s-.6902 1.1168-.7465 1.19c-.0425-.0365-.1437-.2285-.214-.3205-3.915-5.4155-12.781 2.9145-19.456 12.574-2.5698 3.7145-5.8415 7.8968-9.234 10.916 0 0-5.0258 4.607-7.1732 1.297-.785-1.3908-.5435-3.424-.1007-4.7592 2.5002-7.1172 6.8085-13.576 11.711-17.474 1.384-1.0788 2.8882-1.3908 3.6348-.9332.7112.4215.826 1.4635.376 2.1772-1.1418-.0365-2.0565.3105-2.8002 1.079-1.465 1.537-1.974 3.0192-1.5082 4.41 2.2628 3.22 6.7755-3.1472 6.5572-7.026-.078-1.3908-.82-2.7078-1.9272-3.3488-1.6502-.9875-4.1678-.7318-5.797.0555-2.181.823-5.6335 3.6952-7.6488 5.9278-2.537 2.7998-6.888 5.9098-8.2488 5.5615.4457-1.1898 4.121-8.7092.2547-11.526zm31.762 40.709c-7.442-4.794-17.542-5.6352-33.83-1.1162-17.364 4.0805-23.154 6.6962-30.757 1.4452-2.921-2.5795-3.9683-6.7328-3.1862-12.715 1.8138-9.7525 6.7152-19.138 15.422-29.548 4.8598-5.4155 9.3675-10.063 15.32-11.929 4.562-1.1708 4.1355 2.4145 3.5835 2.9272-.5825 0-1.561.0918-2.3172.5852-.6137.476-2.2985 2.013-2.389 4.0805-.1305 3.165 3.145 2.5062 4.5578.7685 1.5228-1.9582 3.7732-5.7083 2.003-9.2033-.742-1.244-2.024-2.1037-3.6158-2.3965-5.4505-.3115-10.527 2.2867-15.212 5.1592-10.243 7.117-18.439 16.979-23.076 27.774-2.6738 6.5132-5.0918 15.843-1.4672 23.437 2.8038 5.269 8.6248 8.0678 15.57 7.4825 4.8708-.5117 10.76-2.086 14.722-3.0365 3.9612-.952 24.238-7.9222 30.901 4.209 0 0 2.2155-4.3008 7.7522-4.3925 4.552-.42 11.119 1.3178 15.901 4.83-1.5932-2.396-6.1102-5.9272-9.8785-8.361z" fill="currentColor"/></svg>`,
                  },
                },

                {
                  name: 'Roblox',
                  href: 'https://www.theguardian.com/culture/2022/jun/09/what-exactly-is-ai-generated-art-how-does-it-work-will-it-replace-human-visual-artists',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 -43.45625 1300 260.7375"><path fill="currentColor" style="line-height:125%;-inkscape-font-specification:'Gill Sans Ultra Bold, Bold';text-align:start;isolation:auto;mix-blend-mode:normal;solid-opacity:1" d="M198.435 0l-35.826 137.998 137.998 35.827 35.826-137.998zM0 15.34v143.165h63.327v-53.006c8.944 0 15.51 4.315 19.7 12.946 4.253 8.631 6.975 21.984 8.163 40.06h65.766c-3.003-28.083-12.228-50.942-27.677-68.58 10.883-7.63 16.325-18.2 16.325-31.71 0-12.26-4.628-22.454-13.885-30.584-9.256-8.194-21.985-12.29-38.184-12.29zm350.645 0v143.165h99.915c15.511 0 27.551-3.596 36.12-10.789 8.631-7.192 12.946-16.793 12.946-28.802 0-7.693-1.906-14.103-5.722-19.232-3.815-5.191-9.413-9.726-16.793-13.604 12.446-7.068 18.67-17.324 18.67-30.771 0-12.322-4.691-22.048-14.073-29.178-9.319-7.192-23.142-10.788-41.467-10.788zm168.125 0v143.165h118.96v-35.932h-55.54V15.341zm298.476 0l55.915 70.738-55.915 72.427h68.861l21.86-28.426 22.703 28.426H1000l-57.603-72.802 54.133-70.362h-68.768l-20.17 26.362-21.11-26.362zm-159.75.286V158.2H800.07V15.626zm-243.43 28.516h3.846c11.133 0 16.7 4.629 16.7 13.885 0 5.129-1.44 8.756-4.316 10.883-2.877 2.064-7.755 3.096-14.635 3.096h-1.595zm-350.74.657h3.847c5.379 0 9.225 1.438 11.539 4.315 2.314 2.815 3.472 6.1 3.472 9.852 0 8.944-5.692 13.415-17.075 13.415h-1.782zm176.328 25.327l26.652 6.92-6.92 26.653-26.65-6.92zm475.36 3.019h27.537v27.535h-27.536zM414.067 96.023h4.409c11.82 0 17.732 5.378 17.732 16.136 0 5.441-1.564 9.288-4.69 11.54-3.066 2.19-8.226 3.283-15.48 3.283h-1.971z" color="currentColor" font-weight="700" font-size="314" font-family="Gill Sans Ultra Bold"/></svg>`,
                  },
                },
                {
                  name: 'Tesla',
                  href: 'https://techcrunch.com/2022/08/02/ai-art-generated/',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 -71.25325 1300 427.5195"><path fill="currentColor" d="M541.817 184.201c0 30.971-38.541 29.133-38.541 29.133h-38.54v-55.963h38.54c39.663-.266 38.541 26.83 38.541 26.83M464.736 72.023h29.368c30.496 1.611 29.345 24.316 29.345 24.316 0 28.216-33.721 28.676-33.721 28.676h-24.992zm69.952 63.997s26.38-11.241 26.145-41.057c0 0 4.012-48.864-60.729-54.824h-71.838v204.849h82.344s68.802.205 68.802-57.799c-.001 0 1.626-39.473-44.724-51.169M348.773 0h302.453v285.013H348.773zM193.041 184.201c0 30.971-38.541 29.133-38.541 29.133h-38.543v-55.963H154.5c39.666-.266 38.541 26.83 38.541 26.83M115.957 72.023h29.374c30.497 1.611 29.343 24.316 29.343 24.316 0 28.216-33.719 28.676-33.719 28.676h-24.998zm69.958 63.997s26.384-11.241 26.147-41.057c0 0 4.009-48.864-60.732-54.824H79.489v204.849h82.349s68.801.205 68.801-57.799c0 0 1.621-39.473-44.724-51.169M0 0h302.453v285.013H0zm938.301 54.825v37.846s-36.942-22.702-77.764-23.159c0 0-76.161-1.495-79.594 73.005 0 0-2.751 68.513 78.676 72.417 0 0 34.165 4.115 80.514-25.441v39.195s-62.173 36.939-134.197 8.488c0 0-60.545-22.109-62.851-94.659 0 0-2.518-74.619 78.23-99.389 0 0 21.563-8.255 60.313-4.586.001-.001 23.161 2.29 56.673 16.283M697.547 285.013H1000V0H697.547z"/></svg>`,
                  },
                },
                {
                  name: 'Balenciaga',
                  href: 'https://www.nytimes.com/2022/10/21/technology/generative-ai.html',
                  media: {
                    format: 'html',
                    html: `<svg  class="h-12" xmlns="http://www.w3.org/2000/svg" viewBox="-41.8008 -9.08425 362.2736 54.5055"><path fill="currentColor" d="M238.077 14.382v21.912h7.027V21.705h25.575v14.589h7.022V14.42l-39.624-.038m6.244-7.088h27.02c3.753-.746 6.544-4.058 7.331-7.262h-41.681c.779 3.205 3.611 6.516 7.33 7.262m-27.526 29.014c3.543-1.502 5.449-4.1 6.179-7.14h-31.517l.02-29.118-7.065.02v36.238h32.383M131.874 7.196h24.954c3.762-1.093 6.921-3.959 7.691-7.136h-39.64v21.415h32.444v7.515l-25.449.02c-3.988 1.112-7.37 3.79-9.057 7.327l2.062-.038h39.415V14.355h-32.42V7.196m-61.603.069h27.011c3.758-.749 6.551-4.058 7.334-7.265H62.937c.778 3.207 3.612 6.516 7.334 7.265m0 14.322h27.011c3.758-.741 6.551-4.053 7.334-7.262H62.937c.778 3.21 3.612 6.521 7.334 7.262m0 14.717h27.011c3.758-.747 6.551-4.058 7.334-7.263H62.937c.778 3.206 3.612 6.516 7.334 7.263M0 .088c.812 3.167 3.554 6.404 7.316 7.215h11.37l.58.229v28.691h7.1V7.532l.645-.229h11.38c3.804-.98 6.487-4.048 7.285-7.215v-.07H0v.07"/></svg>`,
                  },
                },
              ],
              label: 'Used by Influencers and Executives In These Companies',
            },
          }),
          await factory.create({
            templateId: 'tour',
            userConfig: {
              items: [
                {
                  layout: 'right',
                  heading: 'A Seamless Personal Branding Experience',
                  subHeading: 'All the best practices in one place. Create a brand guide, site, blog, newsletter, email list, all in one place.',
                  splash: { url: new URL('img/fig-website-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-website-alt-1.svg', import.meta.url).href } }],
                  actions: [],
                },
                {
                  layout: 'left',
                  heading: 'Own Your Network and Build An Audience',
                  subHeading: 'Fiction helps you build your own email list, and a captive audience that you can easily manage.',
                  splash: { url: new URL('img/fig-subscribe-screen.svg', import.meta.url).href,
                  },
                  overlays: [{ media: { url: new URL('img/fig-subscribe-alt-1.svg', import.meta.url).href } }],
                  actions: [],
                },
                {
                  layout: 'right',
                  heading: 'Email Personal Updates &amp; Your Newsletter',
                  subHeading: 'Fiction helps you build your own email list, and a captive audience that you can easily manage.',
                  splash: { url: new URL('img/fig-email-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-email-alt-1.svg', import.meta.url).href } }],
                  actions: [],
                },
                {
                  layout: 'left',
                  heading: 'Create Passive Income, Achieve Your Goals',
                  subHeading: 'Use your personal brand as a way to build influence and reach your goals. Sell memberships and more to earn.',
                  splash: { url: new URL('img/fig-money-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-money-alt-1.svg', import.meta.url).href } }],
                  actions: [],
                },
                {
                  layout: 'right',
                  heading: 'Resume 2.0 &mdash; Automate Your Personal Branding',
                  subHeading: 'Fiction also provides brand assets and strategy based on your persona and goals.',
                  splash: { url: new URL('img/fig-contact-screen.svg', import.meta.url).href },
                  actions: [],
                },
              ],
            },
          }),
        ],
      }),
      await factory.create({
        templateId: 'area',
        userConfig: {},
        cards: [
          await factory.create({
            templateId: 'metrics',
            userConfig: {
              items: [
                {
                  name: 'Launched',
                  desc: 'Websites Deployed',
                  value: 8000,
                },
                {
                  name: 'Emails Sent',
                  desc: 'To Subscribers',
                  value: 2_020_000,
                },
                {
                  name: 'Dollars Earned',
                  desc: 'Revenue',
                  format: 'abbreviatedDollar',
                  value: 12_000_000,
                },
              ],
            },
          }),
          await factory.create({
            templateId: 'quotes',
            userConfig: {
              quotes: [
                {
                  text: `Going on a date? Your 'blind' date has Googled your name. Going to a job interview? Ditto.`,
                  author: {
                    name: 'Tim Ferris',
                    image: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/12556c45-5956-4c71-aebf-c86a0ed45400/public',
                    },
                    title: 'Author of The 4-Hour Workweek',
                  },
                  org: {
                    name: 'Tim Ferris',
                  },

                },
                {
                  text: `In today's digital world, your personal brand is often your first impression - make it count.`,
                  author: {
                    name: 'Gary Vaynerchuk',
                    image: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/1a443428-3409-4ed1-7cc8-acb57f566700/public',
                    },
                    title: 'Entrepreneur & Author',
                  },
                  org: {
                    name: 'VaynerMedia',
                  },
                },
              ],
            },
          }),
        ],
      }),
      await factory.create({
        templateId: 'area',
        userConfig: {
          standard: {
            scheme: {
              base: {
                primary: 'blue',
                theme: 'blue',
                bg: {
                  bgGradient: { angle: 45, stops: [
                    { theme: 'blue', scale: 950, opacity: 0, percent: 50 },
                    { theme: 'blue', scale: 950, opacity: 0.8, percent: 100 },
                  ] },
                },
              },
            },
          },
        },
        cards: [
          await factory.create({
            templateId: 'hero',
            userConfig: {
              standard: {
                spacing: { verticalSpacing: 'lg' },
              },
              heading: `Is Personal Marketing Right For You?`,
              subHeading: `Are you ready to take control of your future? They say: where there is a will, there is a way. Fiction is the way.`,
              actions: [
                {
                  name: 'Let\'s Get Started',
                  icon: 'i-tabler-rocket',
                  href: '/auth/login?_reload=1',
                  theme: 'primary',
                },
              ],
            },
          }),
        ],
      }),
    ],
  })
}
