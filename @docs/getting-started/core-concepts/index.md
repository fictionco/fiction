---
title: Core Concepts, Goals and Philosophy
description: What is Factor and why is it useful? Learn how it solves common development problems and how it compares to alternative approaches.
---

# Core Concepts

If you want to build a solid app or website that will stand the test of time; than you better do your homework. Here we'll walk through some of the problems we've encountered and explain the design choices that make Factor ideal to solve them. 

## Problems and Solutions

### Working Across Environments (Portability)

**Problem**
Today, the most common CMS structure&mdash;used by tools like WordPress, Drupal, Ghost, etc.&mdash; is to combine everything together into one giant "monolith." That means the code for your your database, image storage, email, app all live together in the same install.  

While this may have certain advantages, there is one massive problem that arises: *you can't work easily across environments*. In other words, your development work and production work are always going to be different. This leads to challenges because things that work locally, might break when you push to production. 

Also, you may want to share a database or images across multiple websites or apps. This isn't possible with the monolithic approach without working with their APIs (and adopting a bunch more code in the process.)

**Solution**
Factor follows the [12 Factor App methodology](https://12factor.net) which outlines a strategy for achieving maximum portability in your applications. It does this by having your connect key services&mdash;like your image storage and database&mdash; which allows you to easily share them across multiple apps. 

### Scaling Servers Cheaply

**Problem**
The ability of your application to "scale" is important, not necessarily because you'll be pushing millions of page views, but also because this directly correlates to the cost of running your app.

Many server-rendered CMS' and frameworks are notoriously hard to scale. With WordPress, for example, there are 100s of blogs dedicated just to this subject.  

The reason for is because, by default, they rerun all queries and rendering for every visitor on every page load. This can be solved somewhat by caching but becomes very challenging when you want to deliver user specific content (that is different for every visitor). 

**Solution**
A new standard in client side authentication JSON Web Tokens (JWTs) make it easy to handle authentication fully in the user's browser (instead of a session on your server). 

In Factor, all routes are served with the same content. Once the HTML is rendered, it uses an endpoint to establish the user's status and change the page accordingly. This round-trip costs around 500ms but makes for an applications that is massively easier to scale and much cheaper to run.

### Extensibility in JavaScript Apps

**Problem**
JavaScript frameworks are nice for easily getting started with a basic structure. However, these frameworks all suffer from a common flaw: they are difficult to extend. Why? Because in an effort to remain un-opinionated, they leave the structure of your dashboard, database, and data to the user.

This works well for certain use cases. But in the case of extension, it means that plugins and themes can only do so much. 

Because they don't know data they can't easily add information to it, because they don't know what your CMS looks like, they can't provide tools for it. All that then has to be added by you, which takes a ton of time.

**Solution**
The key to extension is standardization of the entire application stack, along with providing a standard for the data model and dashboard. These are the interfaces that plugin authors need to know about to deliver you maximal value in minimal time.  In Factor, we've carefully selected technologies and used best practices to build a simple yet robust data standard. 

### Avoiding Proprietary APIs and Services

**Problem**
Recently the idea of using static sites along with APIs to drive functionality has taken hold (i.e. JamStack). While this approach has its applications, it quickly gets out of hand if you'd like to build anything but the most basic of static apps. 

APIs can be problematic. They are usually non-standard services that typically lock you in and make you pay for the privilege. It is also hard to work across APIs. Things can quickly become a spider web of requests and integrations that are nearly impossible to test and debug quickly or effectively. 

**Solution**
Static sites are nice, sometimes. However, if you'd like to build a real app or website, the solution is an old idea: having a back-end server connected to your app. This allows you to do things like authentication, form handling, emailing, without having to rely on and pay for third parties.

It also comes with added benefits like server side rendering, instant editing (no build step), etc.. 

### Avoiding Full-Stack Complication 

**Problem**
Most full stack applications are a compilation of dozens of technologies. In addition, an app may use code bases for the backend which have nothing in common with the tools used on the frontend. This commonly leads to high cognitive costs when switching between environments and some developers don't have the capability or th skills to work in both environments.

**Solution**
Factor approaches this problem by first using JavaScript related technologies for everything; adding TypeScript for help with stability on the backend. From there, it creates a synergy layer that is designed to make interacting with it feel like one cohesive structure. 

### Optimizing for Search and Sharing

**Problem**
Most applications and websites consider search and sharing optimization paramount to their growth and success. Since search engines and scrapers have a hard time rendering JavaScript, this is a challenge in many JS based approaches.  Single-page applications (SPAs), don't render source so they have a notorious problem dealing with this (the source is same for all pages). This has led to the rise in static, but static sites always require build steps and APIs. 

**Solution**
Server-rendering (SSR) is not obsolete, however it is difficult to implement. Since Factor already has a backend server, needed for endpoints, it was just one step further to provide robust SSR for all pages and routes. 

## Architecture

### Overview

### Framework

### Dashboard and Posts Model

### Extensions

## Technology Choices

### Overview

### Vue

### MongoDB

### TypeScript 

### Other Tools

## Software Philosophy

The detailed picture is covered in the core concepts document, but here are some key "rules" we follow to deliver a superior product:

- **Build on an Open-Source Stack.** Working with proprietary technology often leads to risks and costs in the long term. We've found that open-source tech is not only free, but also reduces risk and encourages standardization of your app.

- **80% Rule of Core vs Extension.** Most features belong in an extension; this allows us to keep Factor core light while allowing users to "choose their own adventure" regarding which features they'd like to have (via plugins and themes). The rule is that any core feature must be needed or useful to at least 80% of the user base.

- **The 12 Factor App** The [12 Factor App](https://12factor.net/) guideline discusses how to build apps that are scalable and portable; also, easy to develop. Factor leverages this philosophy.

- **JavaScript and TypeScript Only** In the last years, the one language that has made the most progress is clearly JavaScript and it's type-safe buddy TypeScript. For that reason, Factor is focused on JS and JS oriented libraries. That way you only need to learn one key language and complementary tools.

- 
- - - Problems

    - Extension Oriented
      - Opinionated vs Unopinionated
    - Portability
      - 12 Factor Apps
    - Code First
    - Single Language
    - Dynamic vs Static

  -  

    Architecture

    - Framework + Dashboard + Data Model + Extensions

  -  

    Technology Choices

    - Vue, MongoDB, Webpack, TypeScript

  -  Development and Production

-  Guide to Building Apps
