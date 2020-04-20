---
title: Deploying and Hosting
description: Learn how to deploy your Factor application to a production environment
---

# Deployment and Hosting

You've done it. You're ready to deploy your application to a production environment. The good news it that should be easy, here are some tips.

## How Deployment Works

One of the ideas outlined in the [Twelve-Factor App](https://12factor.net/) is that your development environment and your production environment should be as close to the same as possible. Why? Because it makes deployment easier!

Factor is built for this sort of development. Running `npx factor start` will build and serve your production application locally; and that is the same thing we'll be doing on your live server.

So if you're Factor app is looking good locally, there is a good chance you're ready to go to production.

As outlined in [the Dotenv doc](./dotenv), The only difference will be the environmental configuration which is dictated by the variables in `.env`.

## Deployment Process

## Deployment Guides
