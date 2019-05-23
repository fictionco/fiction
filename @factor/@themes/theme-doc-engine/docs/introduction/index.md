# Introduction
 
## [What is Factor?](#what-is-factor)

Factor is an open-source Javascript platform designed to help you build world-class web applications.

Unlike other Javascript frameworks, Factor provides a drop-in extension experience which allows for less configuration and trial-and-error.

Factor also helps abstract away common server and webpack configuration; which for most developers is ans error-prone and difficult process.  

In the documentation you will learn how to install it, how to use the interface, develop custom apps, as well as extensions (plugins, stacks and themes) for the Factor platform.

**Why Factor?** &mdash; It's main scope is to help manage the complexity of Javascript applications and to provide a platform that massively reduces development time through extension.

It's designed to be both minimal and flexible which means you can use it for any web project, large or small.

Ultimately, with Factor you'll find the experience of building server-rendered Vue.js Application less technical, less time-consuming and more enjoyable.

## [How it Works](#how-it-works)

You can think of Factor as a system that brings together the following:

- **Javascript Framework**
  - CMS Dashboard and Post/Page Management Extensions
  - VueJS SSR (Webpack, etc..)
  
- **Build System**
  - The Factor CLI
  - Serverless Function Emulation and Deployment
  - Development Server 
  
- **Extension Platform**
  - Factor "filters" which allow extensions to "drop themselves in" to requisite parts of your app.
  - Dependency management and loading (via NPM and modules)


## [Features](#features)

- **Dashboard + CMS** 
  - *Posts* &mdash; Quickly publish and manage pages and articles on your site.
  - *Dashboard* &mdash; A beautiful customer dashboard for your app.
  - *Admin* &mdash; A robust UI for your application backend.

- **Extensions**
  - *Themes* &mdash; Get prebuilt-templates, apps and UI with Factor Themes. 
  - *Stacks* &mdash; No more learning dozens of APIs. Use service-stacks instead.
  - *Plugins* &mdash; Add features and functionality for your app in seconds.

- **Framework**
  - *SSR* &mdash; Ideal for performance, seo and sharing.
  - *Serverless* &mdash; No more server to manage and scale.
  - *Reactive* &mdash; Build all your reactive components with the incredible VueJS framework.


## [Diagram](#diagram)

This diagram shows how the build system and application work together to create a cohesive development environment:

![Factor Schema](./diagram.jpg)

## [Concepts](#concepts)

### [Build System](#build)

Factor, at its heart, is a system that coordinates different developer tools and environments to create a consistent and simple development experience. 

The purpose of the this is to abstract away all the configuration, bundling, file generation, etc.. so you can focus on **just building your app.**

Parts of the build system include: 
- CLI (Node)
- Local development server
- Webpack bundling system
- Extension and filter system

While in reality you'll be working across environments (cli, node, cloud, app(client/server)), the build system orchestrates this and makes it feel like a common VueJS/Javascript app.

### [CMS and Dashboard](#cms)

The Factor project was created to help you create web applications without months of wading through APIs and configuration. 

As part of this, there are also a set of common patterns that almost every web app needs and benefits from, which we call the **Factor CMS**. These include: 

- User Dashboard
- Posts and Post Management (in Factor, and similar to WordPress, everything is a post - pages, users, docs, etc... )
- Admin Dashboard 
- Authentication
- Basic Data and Image Storage

While it is possible to use only Factor's build system, many developers who don't want to reinvent the wheel will benefit from the CMS as well. 

### [Stacks](#stacks)

The concept for Factor "stacks" was created out of a deep frustration we experienced working with various service APIs. Specifically, we faced these problems: 
- Lock-In &mdash; Almost every service you use attempts to lock you into their service by encouraging the co-mingling your app with their custom features and APIs. 
- Exponential Learning Curve &mdash; Every service has a different API and approach. Some good and some bad. As you add more and more APIs this problem gets worse as you have more to remember.
- Cost and Wasted Time &mdash; Comparing and shopping for services is a massive time suck. Then once you choose a service you have to optimize it or pay.

So what are "stacks?" Stacks are like themes, but for services. 

For example, Factor and Factor extensions ask for a service to respond to some request, like a text search. You'll then be notified (via CLI) that you need to find a stack to answer this request. Simply install and configure the desired stack extension and you have search working. No more learning dozens of APIs!


### [Themes](#themes)

The concept of themes have always been critical in developing apps for platforms like WordPress, etc.. However, theming is typically neglected in JS frameworks. With Factor this isn't the case. 

The scope of a Factor theme is to give you a more opinionated base application to start with than the raw Factor app. Themes typically add or include extensions of their own, as well as add useful templates and UI tools.

The theme structure is the same as your application structure. This means you can use a theme as starting point or you can inherit from it by adding it in your factor-config file and as a dependency. Inheriting has the added benefit of the theme being 'updateable' which is not possible once you've edited it. 

> **Sidenote:** Factor themes were inspired by the WordPress' child-theme vs parent theme concept.


### [JS Framework](#framework)

Setting up a new JS application can be highly technical and difficult (we know first hand). That's why you really want to use a framework. 

However, we weren't satisfied with the other Vue and React frameworks. That's why we built one. 

When you are evaluating frameworks you should look for the following: 

  - Modular - Functionality should be driven by single purpose modules.
  - Minimal - A clear understanding of scope.
  - Drop-In Extensibility - Extensions should be easy to add and remove
  - Open-Source - We believe in democratizing publishing and the freedoms that come with open source. Supporting this idea is a large community of people collaborating on and contributing to this project.

Factor provides a robust and versatile basis for the development of any JS application. 

A Factor app is structured as follows: 
```yaml
module: package.json (Add dependencies)
config: factor-config.json (Configure theme, plugins, stacks)
app: src/
  controller: plugin.js (Application entry for routes, code, etc...)
  components: component.vue 
  etc: ... (more components)
  template: index.html (Your apps HTML template)
```

### CLI

To work with Factor's NodeJS build system and development environment, all you need is the Factor CLI. 

The CLI is an extensible and fully featured utility that makes all sorts of development tasks trivial. As a primer, here are some key commands: 

To develop in your app just run: 
- `yarn factor dev`

To setup and configure run: 
- `yarn factor setup`

To deploy (once configured) run: 
- `yarn factor deploy`

Extensions can also add their own CLI utilities using the command: 
- `yarn factor run [filter]` (more on this later)

## Ready For More?

We’ve briefly introduced the most basic features of Factor - the rest of this guide will cover them and other advanced features with much finer details, so let's dig in.