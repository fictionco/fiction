# Installation

## Famous 5-Minute Install

Starting a new Factor app should be easy. The goal is to have you up-and-running in **less than 5-minutes**. 

A simple project only needs `@factor/cms` referenced as a package.json dependency. This installs Factor CLI as well as some packages. Let's dig in...

> **Node + Yarn - Global Dependencies** <br/>
> Factor requires [Node.js](https://nodejs.org/en/) version 10 or above, as well as [Yarn](https://yarnpkg.com/en/) for dependency management.

## [Using `create-factor-app`](#create-factor-app)

To get started quickly, we've built a "starter kit" tool: [create-factor-app](https://www.npmjs.com/package/create-factor-app).

> Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since NPM `5.2.0`)

```bash
$ npx create-factor-app <project-name>
```

or with Yarn: 

```bash
$ yarn create factor-app <project-name>
```

Running this command will install some dependencies and start a CLI designed to guide you through the process of creating an app. 

It will ask you a couple questions and then it will install and create a basic Factor app. 

Once it's finished, the next step is to navigate to the project folder and launch it with:

```bash
$ cd <project-name>
$ yarn factor dev
```

With this, your basic starter application should be running at **http://localhost:7777**

## CMS and Dashboard 

Now you're up and running with a basic app; you have fully featured Vue development framework ready to go. But let's take things a big step further: let's setup the CMS. 

Getting the Factor CMS working requires two steps: 

1. Adding a Stack that covers services needed by the core CMS. 
2. Configuring service API keys (with the help of `factor setup`)

### Your First Stack

The starter kit provided should come preconfigured with the Fire Stack, an in-house stack we've developed. It uses: 

- [Google Firebase](https://firebase.google.com) for auth, DB, image storage, endpoints (cloud functions), hosting
- [Google Sign-in API](https://developers.google.com/identity/sign-in/web/sign-in) for Google signin
- [Algolia](https://www.algolia.com/) for improved queries, search and post indexes

Let's set these services up! Don't worry you'll be able to change stacks later without too much effort.

1. The first step is to create an account with Firebase (or Google Cloud Platform (GCP)) and create a project. From your Firebase console you should be able to find your [Firebase Config Object](https://firebase.google.com/docs/web/setup?authuser=0#config-object) and a [Service Account Key](https://console.firebase.google.com/)

2. In your GCP console, go to APIs and Services and make sure the identity API is enabled. You'll need to get the `clientId` and `tokenId` from this service for Google Signin.

3. Then create an account at Algolia and get your  `appId`, `searchKey` and `adminKey`.
  
> **The Stack Solution** <br/>
> Stacks are designed to prevent service lock-in as well as reduce the amount of time spent learning proprietary APIs.


### [The Setup CLI](#factor-setup)

To make the process of configuring your app as painless as possible, Factor has a handy config tool: `yarn factor setup`. 

This tool makes adding all sorts of configuration a straight-forward process since it reduces guess work (and it's also extendable).  

To use, just open up your terminal to your project folder. From there run `yarn factor setup` and you will be provided with a CLI to guide you through the process of adding your API keys to your config. 

### [Visiting The Dashboard](#visiting)

Assuming you've successfully setup your services with their keys, you should be able to visit your application dashboard and admin. To do this, first start your local server `yarn factor dev` once that's going, you should be able to visit the url: `http://localhost:7777/dashboard`.

## Next Up

At this point you should be setup with all you need to start development of a new CMS-powered app. Next we'll learn how to create custom routes and view components.
