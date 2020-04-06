---
title: Core Concepts, Features, and Benefits
description: Factor has many benefits designed to help you build scaleable apps faster.
---

# Core Concepts

Factor strives to be a solid software platform that will stand the test of time. It takes advantage of many of the best practices established by platforms such as Unix or WordPress; but also does it's best to avoid common mistakes that lead to bloated software.

Many of the ideas might not be obvious to newer developers, so in this document we'll explain some of the choices along with why we made them.

## Platform Goals

## Simple 12 Factor Apps - Apps that work anywhere and scale

The [12-Factor App Methodology](https://12factor.net/) was written to highlight some of the best practices you can use to develop a light and portable, developer-friendly app.

Factor follows along with many of these ideas (Factor is extremely portable and scaleable). In comparison with older LAMP based approaches, you'll quickly notice how these topics -- which used to be so painful to deal with -- just seem to fall away into insignificance.

## Useful Extensions

The JS world has [famously](https://news.ycombinator.com/item?id=19517560) had a problem with "reinventing the wheel." This is because with any big change in practice, there is always some aspect of things that must be relearned.

In designing Factor, we've taken the best ideas from the past and applied them to JavaScript apps.

Factor is designed to be "opinionated-enough" to allow for extensions (plugins, themes) that essentially "just work." While it may seem limiting to have some technical choices made for you, this is done with clear intention: the extensions now know what to expect.

As a web professional, the end result is you'll spend much less time reinventing the wheel, and much more time building the thing that makes you successful at the end of the day.

## Content Management (CMS)

Most real apps need some way to manage data objects like pages, transactions, users, etc.. If you build your application with a framework, then typically you'll need to create this yourself or use various SaaS services for each specific management function.

Not so with Factor! Factor includes a simple and standard data management structure that can be leveraged by plugins.

## Other Key Features

### SEO

SEO is incredibly important for most apps and with Factor it's a first-class citizen. With Factor, everything is server-rendered which helps with search-engine and all metatags are supported. Try out the [SEO plugin](https://factor.dev/plugin/seo-factor-plugin) to add standard meta information to any posts you publish.

Factor also has a canonical link system, that is leveraged by plugins like [Sitemap](https://factor.dev/plugin/sitemap-xml).

### Themes

As discussed above, Factor supports extensions that work simply and easily; including themes. Themes are like a pre-made application that you can use to get started in a few minutes. From there, you can customize things easily to meet the goals of your app in record time.

### User Management

Factor also has a rich user management system along with authentication. It can easily be extended to allow for all types of advanced user based application systems including eCommerce.

This system also supports user roles and privileges so you can give specific users rights to access and work with your data.
