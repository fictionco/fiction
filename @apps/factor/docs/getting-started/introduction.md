---
title: Factor Introduction
description: What is Factor and why is it useful? How does it compare to alternative approaches?
---

# Introduction

![Factor - A JavaScript CMS Platform](./splash.jpg)

Factor is a truly open-source CMS platform built for web professionals. It is designed for people who care about quality and don't like limitations. It's also especially nice for teams who need power and flexibility but have deadlines.

Hitting the right balance of needs has led Factor to be used in production by many organizations. Once you learn the basics, you'll love how easy it is to create superior websites and apps.

Every day Factor powers some of the most powerful yet scaleable apps on the internet, it's modern architecture allows for simple caching and optimization which allows you to do more.

## The Problem Factor Solves

Building JavaScript apps is hard and time consuming. There are many possible mistakes that can cost you tons of time.

Factor works to make JS development easier by applying best practices learned by years on the job.

It is minimalist as it an possibly be, but opinionated enough to make your challenging tasks simple. It is also built with tried and true open-source tools which reduces your risks and helps you ship.

## How Factor Is Different

The first question people usually ask is, how is Factor different from everything else out there?

A few key characteristics of Factor:

- **Instant extension** - plugins that "just work," themes that are actually usable.
- **More power with full-stack** - A full stack system means power and simplicity. No more APIs or serverless functions for everything.
- **Simplify with one basic language: Javascript** - Build only with Javascript and Javascript friendly tech (JSON, Mongo, Typescript).
- **Modern tech, modern advantage** - Do things that your friends building PHP apps can only dream of...
- **Remove risk with real open-source** - Built on non-biased open-source tech from developers just like us: Vue, Mongo, Node, Express.

Here is a comparison table to help you quickly see how things compare:

<table class="features-comparison">
  <thead>
    <tr>
      <th></th>
      <th>Factor<br/><small style="text-transform:initial;color:#777;font-weight:400">(JavaScript CMS)</small></th>
      <th>PHP CMS<br/><small style="text-transform:initial;color:#777;font-weight:400">(eg. WordPress)</small></th>
      <th>JAMStack<br/><small style="text-transform:initial;color:#777;font-weight:400">(eg. Gatsby)</small></th> 
      <th>Frameworks<br/><small style="text-transform:initial;color:#777;font-weight:400">(eg. Nuxt, Next)</small></th> 
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><i>1️⃣</i> <span>Single Language</span></td>
      <td>✅</td>
      <td>❌</td>
      <td>❓</td>
      <td>❓</td>
    </tr>
    <tr>
      <td><i>🚀</i> <span>Modern Stack</span></td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><i>🎛</i> <span>Dashboard &amp; CMS</span></td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><i>🔌</i> <span>Easy to Extend</span></td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><i>🎨</i> <span>Usable Themes</span></td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><i>🏎</i> <span>Rapid Development</span></td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td><i>⚡️</i> <span>Dynamic (e.g. Auth)</span></td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><i>📈</i> <span>Easily Scalable</span></td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><i>💼</i> <span>Unified Platform</span></td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>

## Other Important Information

If you're considering Factor, then you'll probably want to know a bit about the philosophy and approach behind the software.

### Built by Fiction

Factor was created as an internal framework for building our own apps at [Fiction.com](https://www.fiction.com).

We started in 2017, building an application for renting monthly homes. In this process, we made MANY mistakes around new technology; continually getting fooled by the large marketing budgets of big corporations or venture funded companies.

After wasting many months reading technical documentation, debugging, reinventing the wheel, and discovering undisclosed limitations of proprietary services; we decided we needed to formalize our software approach and build something simple and standard, based on the best philosophical ideas from the last 50 years of software development.

With that, we started building Factor.

### Software Philosophy

The detailed picture is covered in the core concepts document, but here are some key "rules" we follow to deliver a superior product:

- **Build on an Open-Source Stack.** Working with proprietary technology often leads to risks and costs in the long term. We've found that open-source tech is not only free, but also reduces risk and encourages standardization of your app.

- **80% Rule of Core vs Extension.** Most features belong in an extension; this allows us to keep Factor core light while allowing users to "choose their own adventure" regarding which features they'd like to have (via plugins and themes). The rule is that any core feature must be needed or useful to at least 80% of the user base.

- **The 12 Factor App** The [12 Factor App](https://12factor.net/) guideline discusses how to build apps that are scaleable and portable; also, easy to develop. Factor leverages this philosophy.

- **JavaScript and TypeScript Only** In the last years, the one language that has made the most progress is clearly JavaScript and it's type-safe buddy TypeScript. For that reason, Factor is focused on JS and JS oriented libraries. That way you only need to learn one key language and complementary tools.
