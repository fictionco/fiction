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

## Setting Environmental Variables

The main difference between your local and production server will be defined by [environmental variables](./dotenv). While in your local setup, you only need to add the values to `.env`, sometimes it can be tricky (depending on your host.)

Reference your host's documentation to see how they recommend you add and configure environmental variables.

## Deployment Process

Deploying to production typically follows one of these two work flows:

1. Build production app locally - `npx factor build`
2. Upload built code (in `/dist`) to server
3. Verify dependencies on server `npm install`
4. Run server - `npx factor serve`

Or...

1. Commit or upload app to build environment or server
2. It builds the production app (`npx factor build`)
3. It then uploads the built code (in `/dist`) to server
4. Verify dependencies on server `npm install`
5. Run server - `npx factor serve`

## Deployment Guides

- [Deploying an app on Heroku](./heroku)
