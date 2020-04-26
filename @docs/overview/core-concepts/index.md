---
title: Core Concepts, Goals and Philosophy
description: What is Factor and why is it useful? Learn how it solves common development problems and how it compares to alternative approaches.
sub: true
---

# Core Concepts

If you want to build a solid app or website that will stand the test of time; than you better do your homework. Here we'll walk through some of the problems we've encountered and explain the design choices that make Factor ideal to solve them.

## Problems and Solutions

### Working Across Environments (Portability)

**Problem**
Today, the most common CMS structure&mdash;used by tools like WordPress, Drupal, Ghost, etc.&mdash; is to combine everything together into one giant "monolith." That means the code for your your database, image storage, email, app all live together in the same install.

While this may have certain advantages, there is one massive problem that arises: _you can't work easily across environments_. In other words, your development work and production work are always going to be different. This leads to challenges because things that work locally, might break when you push to production.

Also, you may want to share a database or images across multiple websites or apps. This isn't possible with the monolithic approach without working with their APIs (and adopting a bunch more code in the process.)

**Solution**
Factor follows the [12 Factor App methodology](https://12factor.net) which outlines a strategy for achieving maximum portability in your applications. It does this by having your connect key services&mdash;like your image storage and database&mdash; which allows you to easily share them across multiple apps.

![Traditional CMS(Monolith) vs Factor](./monoliths-vs-factor.jpg)

### Scaling Servers Cheaply

**Problem**
The ability of your application to "scale" is important, not necessarily because you'll be pushing millions of page views, but also because this directly correlates to the cost of running your app.

Many server-rendered CMS' and frameworks are notoriously hard to scale. With WordPress, for example, there are 100s of blogs dedicated just to this subject.

The reason for is because they re-render everything whenever someone loads a page. This can be solved somewhat by caching but becomes very challenging when you want to deliver user specific content.

**Solution**
Factor handles authentication fully in the user's browser (instead of a session on your server). This means all routes are served with the same content.

When you serve the same content to everyone, it's easily cached and therefore cheap to scale.

### Extensibility in JavaScript Apps

**Problem**
JavaScript frameworks are nice for easily getting started with a basic structure. However, these frameworks all suffer from a common flaw: they are difficult to extend. Why? Because in an effort to remain un-opinionated, they leave the structure of your dashboard, database, and data to the user.

This works well for certain use cases. But in the case of extension, it means that plugins and themes can only do so much.

**Solution**
As opposed to JS frameworks, with older CMS' they learned that when you standardize of the entire application stack, as well as data and management, then plugins can do way more.

In Factor, we've taken this idea and carefully selected open-source technologies to standardize a stack that can be easily extended.

### Avoiding Proprietary APIs and Services

**Problem**
Recently the idea of using static sites along with APIs to drive functionality has taken hold (i.e. JamStack). While this approach has its applications, it quickly gets out of hand if you'd like to build anything but the most basic of static apps.

APIs can be problematic. They are usually non-standard services that typically lock you in and make you pay for the privilege. It is also hard to work across APIs. Things can quickly become a web of requests and integrations that are nearly impossible to work with effectively.

**Solution**
The solution is an old idea: having a back-end server connected to your app. This allows you to do things like authentication, form handling, emailing, without having to rely on and pay for third parties.

It also comes with added benefits like server side rendering, instant editing (no build step), etc..

### Avoiding Full-Stack Complication

**Problem**
Most full stack applications are a compilation of dozens of technologies which sometimes don't work well together. This commonly leads to high cognitive costs when switching between environments and tools.

**Solution**
Factor approaches this problem by first using JavaScript related technologies for everything; adding TypeScript for help with stability on the backend. From there, it creates a synergy that is designed to make interacting with it feel like one cohesive structure.

### Optimizing for Search and Sharing

**Problem**
Most applications and websites consider search and sharing optimization paramount to their growth and success. Since search engines and scrapers have a hard time rendering JavaScript, this is a challenge in many JS based approaches. Single-page applications (SPAs), don't render source so they have a notorious problem dealing with this (the source is same for all pages). This has led to the rise in static, but static sites always require build steps and APIs.

**Solution**
Server-rendering (SSR) is not obsolete, however it is difficult to implement. Since Factor already has a backend server, needed for endpoints, it was just one step further to provide robust SSR for all pages and routes.

## Architecture

#### Overview

There is a clear architecture needed to create a framework capable of being effective CMS. It must include a standard for both a development structure as well as a data and data-management structure. Factor consists of the following major elements:

### Framework

Factor features a fully featured development framework. It can be used stand-alone in similar to use cases to a more typical JS frameworks; but it also serves as the basis for building data management features as well as the extension API. The framework includes:

- A fully featured Vue framework (`*.vue`)
- Native TypeScript support (`*.ts` optional)
- A CLI for serving, building, bundling your app
- Server-side rendering and search optimization
- Complete routing and permalink system
- Static file serving
- Development server with hot reloading
- Pre-processors and libraries: LESS, Tailwind, etc.
- Extensible modular architecture

### Data and Management

On top of the core framework, Factor includes a standard for data management and structure. We call this the "data model." In practice, these features are purely optional. You can use Factor as a stand-alone framework as well; however, they offer remarkably interesting capabilities for plugins and themes.

The dashboard and posts model includes:

- A themeable dashboard structure
- A simple, standard database design with only one collection/table
- Posts and post types
- Taxonomy (categories, tags, search)
- Automated data fetching, storage and handling
- Fully featured post editing capabilities
- Plugable structure that can be leveraged by extensions

### Extensions

Now that we have both a fully featured framework and a data management structure, we have awesome capabilities in plugins and themes. Extensions in Factor are designed to be easier to install and to "just work." The extensions API in Factor includes:

- **Filters** - work with data at the point it's used. Plugins and themes can alter any data in the core Factor system.
- **Callbacks** - An async system that allows you to run functions at certain key points in Factor's operation. For example, after a user authenticates.
- **Events** - Respond to events in Factor, e.g. when an error occurs, or an email is sent.

All this allows for interesting capabilities for extensions and it all just works when you add them to your project. Examples of ways to use posts might be job listings, forms, chat, forums, etc.

## Technology Choices

#### Overview

In designing Factor it became necessary to make opinionated choices around key elements in the technology stack. Aside from the requirement that all technology is open-source, there are some nuanced reason for the decisions made; here is the reasoning:

### Vue

As a core UI framework, Factor uses Vue exclusively. We made this decision for the following reasons:

- **Fully featured and carefully implemented codebase.** Evan You the creator of Vue clearly works hard to craft a well designed framework that will stand the test of time.
- **No corporate bias.**
  - All the competitive solutions suffer from some form of corporate bias which is largely the reason they are successful. In the case of Vue, it was successful purely because of its merits and quality.
  - Corporate bias can lead to [conflicts of interest](https://thenextweb.com/dd/2017/09/25/facebook-re-licenses-react-mit-license-developer-backlash/) in the direction and decisions regarding a platform.
- **Standards Oriented.**
  - Vue is designed to be as close to standard JS, HTML, etc. as possible. That means you'll spend less time learning custom APIs and syntax and more time building standard skill sets.

### MongoDB

Factor has chosen to work with the MongoDB/Mongoose API for the database layer (not necessarily MongoDB, see below):

- **The JavaScript oriented DB.** MongoDB is designed from the beginning for JSON and is easy to work with in modern applications.
- **Dead-simple setup.** SQL databases are highly technical to manage and setup. In contrast, MongoDB is very easy to work with. All that's needed to create your DB is a working install and a "connection string" to get a DB working.
- **Standard / Flexibility.** Working with the Mongo API does not necessarily mean you're stuck with MongoDB. DynamoDB (Amazon) and CosmosDB (Microsoft) are designed to support the same API and can work with plugins.
- **Portability.** Using MongoDB removes the need to use an abstraction layer like GraphQL or REST API. Mongo works "over the wire" by default, just connect it and start making queries.

### TypeScript

Type checking is a super helpful tool as it relates to stability and rapid development. Factor supports it natively and is also written in TypeScript. We chose this for these reasons:

- **Type-Checking is needed.** Working with un-typed JS is a stability nightmare. Its flexible nature leads to big problems when using it as a backend technology. In recent months, TypeScript has established itself the standard in writing "JavaScript that scales" and as libraries have support it, it has become easier to use and more helpful.
- **Rapid development.** TypeScript massively speeds up development of quality code.
- **The future of JS.** TypeScript is so helpful that we believe it will continue to improve and will lead to even more advantages in the future.

### Other Tools

There are many other tools at use in Factor. Most of them however are not "permanent" and can be replaced as needed in the future. Here are some keys ones along with why we chose them:

- **WebPack** - Used for building the application. While WebPack is bloated and verbose, it is the standard and is virtually a requirement for working with Vue.

## Software Philosophy

The detailed picture is covered in the core concepts document, but here are some key "rules" we follow to deliver a superior product:

- **Simple as possible, not simpler.** All features and code sets that are added to Factor core have a clear reason for being there. Anything else belongs in an extension.
- **80% Rule of Core vs Extension.** Most features belong in an extension; this allows us to keep Factor core light while allowing users to "choose their own adventure" regarding which features they'd like to have (via plugins and themes). The rule is that any core feature must be needed or useful to at least 80% of the user base.
- **Unix philosophy.** Factor generally follows the rules and guidelines outlined in books about the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy). Essentially, this means we:
  - Favor portability over efficiency.
  - Use small modules with one key purpose.
  - Build new modules rather than add new features to old ones.
- **The 12 Factor App** The [12 Factor App](https://12factor.net/) guideline discusses how to build apps that are scalable and portable; also, easy to develop. Factor leverages this philosophy.
- **JavaScript and TypeScript Only** In the last years, the one language that has made the most progress is clearly JavaScript and it's type-safe buddy TypeScript. For that reason, Factor is focused on JS and JS oriented libraries. That way you only need to learn one key language and complementary tools.
- **The value of open-source.** Working with proprietary technology often leads to risks and costs in the long term. We've found that open-source tech is not only free, but also reduces risk and encourages standardization of your app.
