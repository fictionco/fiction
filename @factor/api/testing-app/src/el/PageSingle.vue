<template>
  <main>
    <div class="bg-gray-900 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14">
      <div class="mx-auto max-w-7xl lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <div
            class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left"
          >
            <div class="lg:py-24">
              <RouterLink
                :id="randomId()"
                :to="randomRoute()"
                class="inline-flex items-center rounded-full bg-black p-1 pr-2 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
              >
                <span
                  class="rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-3 py-0.5 text-xs font-semibold uppercase leading-5 tracking-wide text-white"
                  >We're hiring</span
                >
                <span class="ml-4 text-sm">Visit our careers page</span>
                <!-- Heroicon name: solid/chevron-right -->
                <svg
                  class="ml-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </RouterLink>
              <h1
                class="mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl"
              >
                <span class="block">A better way to</span>
                <span
                  class="block bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text pb-3 text-transparent sm:pb-5"
                  >ship web apps</span
                >
              </h1>
              <p
                class="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl"
              >
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat.
              </p>
              <div class="mt-10 sm:mt-12">
                <form action="#" class="sm:mx-auto sm:max-w-xl lg:mx-0">
                  <div class="sm:flex">
                    <div class="min-w-0 flex-1">
                      <label for="email" class="sr-only">Email address</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        class="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                      />
                    </div>
                    <div class="mt-3 sm:mt-0 sm:ml-3">
                      <button
                        type="submit"
                        class="block w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 py-3 px-4 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Start free trial
                      </button>
                    </div>
                  </div>
                  <p class="mt-3 text-sm text-gray-300 sm:mt-4">
                    Start your free 14-day trial, no credit card necessary. By
                    providing your email, you agree to our
                    <RouterLink
                      :id="randomId()"
                      :to="randomRoute()"
                      class="font-medium text-white"
                      >terms of service</RouterLink
                    >.
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div class="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
            <div
              class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0"
            >
              <!-- Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ -->
              <img
                class="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                src="https://tailwindui.com/img/component-images/cloud-illustration-teal-cyan.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature section with screenshot -->
    <div class="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
      <div
        class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <div>
          <h2
            class="text-base font-semibold uppercase tracking-wider text-cyan-600"
          >
            Serverless
          </h2>
          <p
            class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            No server? No problem.
          </p>
          <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Phasellus lorem quam molestie id quisque diam aenean nulla in.
            Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
            condimentum id viverra nulla.
          </p>
        </div>
        <div class="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
          <img
            class="rounded-lg shadow-xl ring-1 ring-black/5"
            src="https://tailwindui.com/img/component-images/green-project-app-screenshot.jpg"
            alt=""
          />
        </div>
      </div>
    </div>

    <!-- Feature section with grid -->
    <div class="relative bg-white py-16 sm:py-24 lg:py-32">
      <div
        class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <h2
          class="text-base font-semibold uppercase tracking-wider text-cyan-600"
        >
          Deploy faster
        </h2>
        <p
          class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
        >
          Everything you need to deploy your app
        </p>
        <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          Phasellus lorem quam molestie id quisque diam aenean nulla in.
          Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
          condimentum id viverra nulla.
        </p>
        <div class="mt-12">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/cloud-upload -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    Push to Deploy
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Ac tincidunt sapien vehicula erat auctor pellentesque
                    rhoncus. Et magna sit morbi vitae lobortis.
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/lock-closed -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    SSL Certificates
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Qui aut temporibus nesciunt vitae dicta repellat sit dolores
                    pariatur. Temporibus qui illum aut.
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/refresh -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    Simple Queues
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Rerum quas incidunt deleniti quaerat suscipit mollitia. Amet
                    repellendus ut odit dolores qui.
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/shield-check -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    Advanced Security
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Ullam laboriosam est voluptatem maxime ut mollitia commodi.
                    Et dignissimos suscipit perspiciatis.
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/cog -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    Powerful API
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Ab a facere voluptatem in quia corrupti veritatis aliquam.
                    Veritatis labore quaerat ipsum quaerat id.
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div class="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg"
                    >
                      <!-- Heroicon name: outline/server -->
                      <svg
                        class="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium tracking-tight text-gray-900"
                  >
                    Database Backups
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    Quia qui et est officia cupiditate qui consectetur. Ratione
                    similique et impedit ea ipsum et.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonial section -->
    <div
      class="bg-gradient-to-r from-teal-500 to-cyan-600 pb-16 lg:relative lg:z-10 lg:pb-0"
    >
      <div
        class="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8"
      >
        <div class="relative lg:-my-8">
          <div
            aria-hidden="true"
            class="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden"
          ></div>
          <div
            class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:h-full lg:p-0"
          >
            <div
              class="aspect-w-10 aspect-h-6 sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none overflow-hidden rounded-xl shadow-xl lg:h-full"
            >
              <img
                class="object-cover lg:h-full lg:w-full"
                src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="mt-12 lg:col-span-2 lg:m-0 lg:pl-8">
          <div
            class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20"
          >
            <blockquote>
              <div>
                <svg
                  class="h-12 w-12 text-white opacity-25"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path
                    d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                  />
                </svg>
                <p class="mt-6 text-2xl font-medium text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  urna nulla vitae laoreet augue. Amet feugiat est integer dolor
                  auctor adipiscing nunc urna, sit.
                </p>
              </div>
              <footer class="mt-6">
                <p class="text-base font-medium text-white">Judith Black</p>
                <p class="text-base font-medium text-cyan-100">
                  CEO at PureInsights
                </p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog section -->
    <div class="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div class="relative">
        <div
          class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <h2
            class="text-base font-semibold uppercase tracking-wider text-cyan-600"
          >
            Learn
          </h2>
          <p
            class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Helpful Resources
          </p>
          <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Phasellus lorem quam molestie id quisque diam aenean nulla in.
            Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
            condimentum id viverra nulla.
          </p>
        </div>
        <div
          class="mx-auto mt-12 grid max-w-md gap-8 px-4 sm:max-w-lg sm:px-6 lg:max-w-7xl lg:grid-cols-3 lg:px-8"
        >
          <div class="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div class="shrink-0">
              <img
                class="h-48 w-full object-cover"
                src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                alt=""
              />
            </div>
            <div class="flex flex-1 flex-col justify-between bg-white p-6">
              <div class="flex-1">
                <p class="text-sm font-medium text-cyan-600">
                  <RouterLink
                    :id="randomId()"
                    :to="randomRoute()"
                    class="hover:underline"
                  >
                    Article
                  </RouterLink>
                </p>
                <RouterLink
                  :id="randomId()"
                  :to="randomRoute()"
                  class="mt-2 block"
                >
                  <p class="text-xl font-semibold text-gray-900">
                    Boost your conversion rate
                  </p>
                  <p class="mt-3 text-base text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Architecto accusantium praesentium eius, ut atque fuga
                    culpa, similique sequi cum eos quis dolorum.
                  </p>
                </RouterLink>
              </div>
              <div class="mt-6 flex items-center">
                <div class="shrink-0">
                  <RouterLink :id="randomId()" :to="randomRoute()">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Roel Aufderehar"
                    />
                  </RouterLink>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    <RouterLink
                      :id="randomId()"
                      :to="randomRoute()"
                      class="hover:underline"
                    >
                      Roel Aufderehar
                    </RouterLink>
                  </p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time datetime="2020-03-16"> Mar 16, 2020 </time>
                    <span aria-hidden="true"> &middot; </span>
                    <span> 6 min read </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div class="shrink-0">
              <img
                class="h-48 w-full object-cover"
                src="https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                alt=""
              />
            </div>
            <div class="flex flex-1 flex-col justify-between bg-white p-6">
              <div class="flex-1">
                <p class="text-sm font-medium text-cyan-600">
                  <RouterLink
                    :id="randomId()"
                    :to="randomRoute()"
                    class="hover:underline"
                  >
                    Video
                  </RouterLink>
                </p>
                <RouterLink
                  :id="randomId()"
                  :to="randomRoute()"
                  class="mt-2 block"
                >
                  <p class="text-xl font-semibold text-gray-900">
                    How to use search engine optimization to drive sales
                  </p>
                  <p class="mt-3 text-base text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Velit facilis asperiores porro quaerat doloribus, eveniet
                    dolore. Adipisci tempora aut inventore optio animi., tempore
                    temporibus quo laudantium.
                  </p>
                </RouterLink>
              </div>
              <div class="mt-6 flex items-center">
                <div class="shrink-0">
                  <RouterLink :id="randomId()" :to="randomRoute()">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Brenna Goyette"
                    />
                  </RouterLink>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    <RouterLink
                      :id="randomId()"
                      :to="randomRoute()"
                      class="hover:underline"
                    >
                      Brenna Goyette
                    </RouterLink>
                  </p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time datetime="2020-03-10"> Mar 10, 2020 </time>
                    <span aria-hidden="true"> &middot; </span>
                    <span> 4 min read </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div class="shrink-0">
              <img
                class="h-48 w-full object-cover"
                src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                alt=""
              />
            </div>
            <div class="flex flex-1 flex-col justify-between bg-white p-6">
              <div class="flex-1">
                <p class="text-sm font-medium text-cyan-600">
                  <RouterLink
                    :id="randomId()"
                    :to="randomRoute()"
                    class="hover:underline"
                  >
                    Case Study
                  </RouterLink>
                </p>
                <RouterLink
                  :id="randomId()"
                  :to="randomRoute()"
                  class="mt-2 block"
                >
                  <p class="text-xl font-semibold text-gray-900">
                    Improve your customer experience
                  </p>
                  <p class="mt-3 text-base text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint harum rerum voluptatem quo recusandae magni placeat
                    saepe molestiae, sed excepturi cumque corporis perferendis
                    hic.
                  </p>
                </RouterLink>
              </div>
              <div class="mt-6 flex items-center">
                <div class="shrink-0">
                  <RouterLink :id="randomId()" :to="randomRoute()">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Daniela Metz"
                    />
                  </RouterLink>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    <RouterLink
                      :id="randomId()"
                      :to="randomRoute()"
                      class="hover:underline"
                    >
                      Daniela Metz
                    </RouterLink>
                  </p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time datetime="2020-02-12"> Feb 12, 2020 </time>
                    <span aria-hidden="true"> &middot; </span>
                    <span> 11 min read </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="relative bg-gray-900">
      <div
        class="relative h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2"
      >
        <img
          class="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&sat=-100"
          alt=""
        />
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 mix-blend-multiply"
        ></div>
      </div>
      <div
        class="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32"
      >
        <div class="md:ml-auto md:w-1/2 md:pl-10">
          <h2
            class="text-base font-semibold uppercase tracking-wider text-gray-300"
          >
            Award winning support
          </h2>
          <p
            class="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            We’re here to help
          </p>
          <p class="mt-3 text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas
            tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim
            et fermentum, augue. Aliquet amet volutpat quisque ut interdum
            tincidunt duis.
          </p>
          <div class="mt-8">
            <div class="inline-flex rounded-md shadow">
              <RouterLink
                :id="randomId()"
                :to="randomRoute()"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Visit the help center
                <!-- Heroicon name: solid/external-link -->
                <svg
                  class="-mr-1 ml-3 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from "vue-router"
import { randomId, randomRoute } from "../utils"
</script>
