---
title: Version 3 is now publicly available
description: Factor version 3 is now publicly available.
excerpt: After a complete rewrite, along with testing, FactorJS version 3 is now publicly available.
authorName: Andrew Powers
authorWebsite: https://linkedin.com/in/arpowers
authorEmail: andrew@fiction.com
authorTwitter: arpowers
publishDate: 2021-6-26
---

## FactorJS v3 - Next Generation Framework

After months of development and [advanced production use](https://www.darwin.so); we've finally made FactorJS v3 publicly available. This release moves Factor to the cutting-edge in JavaScript standards and deprecates legacy libraries like Webpack and Vue2.

There are many updates in this version that we hope you will like, some of the key highlights include:

- New "static first" architecture (i.e. [JamStack](https://en.wikipedia.org/wiki/Jamstack))
- Modern Syntax with TypeScript, Vue3, and Vite
- Minimal design, build simple or complex websites and apps

## Static Framework + Endpoint Framework = JamStack

JavaScript applications are best suited to run statically. This is because in contrast to older frameworks, dynamic features actually happen in the browser (instead of the server).

That said, a shortcoming of static site engines has been that the most apps will still need some code on the server. For example, to work with APIs or a database.

To date, we haven't seen a system that really makes it simple to work with this paradigm. That's why we've created FactorJS v3.

FactorJS deals with this by including two entry points to your code, one for your app and another for your endpoint server.

Then in production, you can run your app with free or cheap static hosting like Github Pages, Netlify, etc. and if needed you can run you endpoint server with any Node host like Heroku.

This has multiple benefits:

- If static functionality is all that is needed, you can host your FactorJS app for _free_
- Dynamic endpoint functionality is scalable, cheap to host and simple to work with. Your server doesn't have to worry about rendering HTML, handling page loads, etc..

## Modern Standards and Syntax

JavaScript has suffered from some standards incompatibilities over the years with none being more painful than the conflict between CommonJS and ESModules.

To reconcile this incompatibility, most frameworks had to use "module bundlers" like , i.e. Webpack, to compile applications to a working application.

This reconciliation process forces the bundler to follow many dependency chains and causes painfully long compile times.

With the rollout of new libraries like [ESBuild](https://esbuild.github.io) and [Vite](https://vitejs.dev), finally, the new school of JavaScript is ready for production.

For months now, FactorJS v3 has been working in production with the most cutting edge libraries and it's made a world of difference.

## In The Wild

FactorJS 3 was developed as the architecture and engine for [Kaption.co's website](https://www.darwin.so) and also it's [dashboard](https://app.darwin.so). In these applications, we are managing users, API handling, DB, email, etc...

During this process we worked through and improved any usability and stability issues that might come up.

You can view the [Factor Showcase](https://www.factorjs.org/showcase) for site examples as well as links to code (if available).

## A Vision of the Future

Factor's core is designed to be simple and to give you the needed structure for apps and extension.

That said, we have already built additional modules for database handling (Postgres), users and auth, post management and more.

If you'd like to help steer development of these modules, please [join the Slack channel](https://join.slack.com/t/factorjs/shared_invite/zt-biopdz00-pnEJOPDPcm8DSTGLccH_Og) and say hello!
