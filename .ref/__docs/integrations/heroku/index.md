---
title: Deploying apps to Heroku
description: Learn how to deploy apps to production using Heroku as a host
---

# Steps to deploying with Heroku

Deploying to Heroku is dead-simple and a recommended way to run your Factor app in production. Getting going only takes a few basic steps.

## Create An Account

Login or set up an account at [Heroku](https://www.heroku.com)

## Create App

Next, create a new application in Heroku.

![Create New App](./create-app.jpg)

## Add Deployment from Github

Next we recommend setting up deployments straight from your Github repo.

- Click on **Deploy** in nav
- Click **Deployment Method** > **Github**
- Connect app
- Click **Enable Automatic Deploys** - Deploys on commit to specific branch

![Deploy from Github](./deploy-from-github.jpg)

## Setup Environment

- Click on **Settings** in nav
- Add your environmental variables. These are the same values in your `.env`
- Add NodeJS Buildpack. This adds Node.

![Config Vars](./config-vars.jpg)

![Buildpack](./buildpack.jpg)

## Add Heroku Commands to Project

### Build on Deploy and Server

Based on [this update](https://devcenter.heroku.com/changelog-items/1557) from Heroku, they will automatically run your `build` and `start` scripts if they are available in `package.json`. So just add them as follows:

```json
{
  "name": "factor-example-project",
  "scripts": {
    "build": "npx factor build",
    "start": "npx factor serve"
  }
}
```

Now whenever you commit to the Git branch you selected for deployment Heroku will automatically build and then serve the app you committed.

> **Note** Heroku offers many more tools for advanced deployments such as [Procfile](https://devcenter.heroku.com/articles/procfile) or special [Buildpacks](https://elements.heroku.com/buildpacks). Reference their documentation for more information.

## View Your Live Site

Under **settings** in heroku, they will give you the settings for configuring your domain and a sandbox `herokuapp` domain that will be immediately available. Visit that site and you should see your live app. Congrats!
