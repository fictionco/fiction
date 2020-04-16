---
title: Introduction and Backstory
description: What is Factor and why is it useful? Learn how it solves common development problems and how it compares to alternative approaches.
---

# Introduction

![Factor - A JavaScript CMS Platform](./splash.jpg)

Factor is an open-source JavaScript platform built for web professionals. It is designed for people who care about quality and don't like limitations. It's also  nice for teams who need power and flexibility but have deadlines.

Hitting the right balance of needs has led Factor to be used in production by many organizations. Once you learn the basics, you'll love how easy it is to create superior websites and apps.

Every day Factor powers some of the most powerful yet scalable apps on the internet. It's modern architecture allows for portability, performance, and optimization which allows you to do more.

## The Problem Factor Solves

Building top-quality JavaScript apps is hard because there is too much reinventing of the wheel. Developers are forced to adopt too much code and things become complicated and brittle quickly. Months can be wasted developing, testing, and debugging code for boilerplate functionality that doesn't add distinct value to your app.

The solution to this problem is to use a core framework to help you with best practices and structure; and then add or develop plugins to reach mission specific goals.

## How Factor Is Different

The first question people usually ask is, how is Factor different from everything else out there?

A few key characteristics of Factor:

- **(Really) Easy Plugins and Themes** - Work with a special architecture that allows you to add new functionality in seconds with plugins and themes to 'just work.' 
- **Server & App in One Environment** - Use a full stack system that combines everything you need from endpoints (auth, ssr) with a robust client-side app framework. This reduces the need for external APIs and simplifies your app's structure as you build advanced features.
- **Javascript Focused** - JavaScript is the most popular and actively developed tool for the web. Life is much simpler when you only need to worry JavaScript and JavaScript-focused complementary frameworks (MongoDB, Vue, TypeScript, Webpack).
- **Modern Portability and Scalability** - Use modern technology that allows applications to be massively easier to scale and work with in different environments. Do things that your friends building PHP apps can only dream of...
- **Open-Source Focused (No SaaS)** - Use an architecture is designed to help you avoid the risks, costs and complication associated with external APIs and services. Build on an open-source stack and increase your chances of success in the long-term.

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
### The Backstory 

Factor was created as an internal framework for building our own apps at [Fiction.com](https://www.fiction.com).

We started in 2017, building an application for renting monthly home, similar in approach to Airbnb. In this process, we made *many* mistakes around new technology; continually getting fooled by the large marketing budgets of big corporations or venture funded companies.

After wasting many months reading technical documentation, debugging, reinventing the wheel, and discovering undisclosed limitations of various services; we decided we needed to formalize our software approach and build something simple and standard, based on the best philosophical ideas from the last 50 years of software development.

With that, we started building Factor.

Prior to Fiction, we were the founders of a web tools company called [PageLines](https://www.pagelines.com), that built frameworks, plugins and themes for WordPress.  We were successful with this, serving over 58,500 paying customers and shipping over 210,000 live websites.  In building Factor, we've used all this experience--including innovations, mistakes, successes and failures--to build something that we think will deliver you outstanding results now and in the future.

### Next Steps

Now that you know a little about Factor, and what it can do for you, you probably want to [install it](./install) or read about it's [core concepts and architecture](./core-concepts).

### Software Philosophy

The detailed picture is covered in the core concepts document, but here are some key "rules" we follow to deliver a superior product:

- **Build on an Open-Source Stack.** Working with proprietary technology often leads to risks and costs in the long term. We've found that open-source tech is not only free, but also reduces risk and encourages standardization of your app.

- **80% Rule of Core vs Extension.** Most features belong in an extension; this allows us to keep Factor core light while allowing users to "choose their own adventure" regarding which features they'd like to have (via plugins and themes). The rule is that any core feature must be needed or useful to at least 80% of the user base.

- **The 12 Factor App** The [12 Factor App](https://12factor.net/) guideline discusses how to build apps that are scalable and portable; also, easy to develop. Factor leverages this philosophy.

- **JavaScript and TypeScript Only** In the last years, the one language that has made the most progress is clearly JavaScript and it's type-safe buddy TypeScript. For that reason, Factor is focused on JS and JS oriented libraries. That way you only need to learn one key language and complementary tools.
