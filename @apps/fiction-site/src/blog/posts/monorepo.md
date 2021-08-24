---
title: Monorepo Workflows - Public and Private Repositories and Yarn Link
---

Behind the scenes here at Fiction, we're working on a [new CMS tool](https://www.fiction.com/factor-js) which we are hoping to open-source at some point. To do this, we want to purse a monorepo setup, for [various reasons](https://danluu.com/monorepo/) that I won't get into here.

I ran into a problem that seemed to be semi-prevalent in the monorepo world, which didn't have a well documented answer (based on my exhaustive Google searching)– and that problem is this:

> How do you use a monorepo that is public, along with my custom app which will be private (without introducing nightmareish workflow issues)?

or in other words: what's the right workflow for monorepos and public and private repositories..

## First, the problem(s)

### [Lerna](https://github.com/lerna/lerna) Doesn't Do Much...

And what it does do, is sort of a workflow complexifier. The reason I mention it is because lots of people seem to think Lerna is the ultimate monorepo tool while what it does is mostly just run commands in different packages, and help you keep version numbers aligned.

What it doesn't do is help you manage your workflow, and if you're not careful you'll end up having to run `lerna bootstrap` all the time to make sure your dependencies are kept aligned between packages.

### Yarn Link / NPM Link Will Drive You Crazy

The **main** point of this article is for me to tell you this: don't try and use NPM or [Yarn Link](https://yarnpkg.com/lang/en/docs/cli/link/). Just don't do it.

While I'm a fan of Yarn, this feature is really half baked for some reason and the devs don't seem to understand how people want to use it at all.

Here's what I experienced,

1. Use "Yarn Link" to add one project into another for workflow purposes. (sounds good!)
2. _Sets up Yarn Link in Project_
3. Yarn link adds symlink but coldly refuses to install any dependencies from the linked project.
4. Googles furiously, only to find years-old articles and bug reports on the subject.
5. Conclusion: Without dependencies installed from linked projects, I'd either have to manually edit the working projects dependencies to match. Creating a problem in workflow which would likely lead to lots of bugs ("oh I forgot to add the dependency again").. or write a build script.

Luckily, a quick solution

## Yarn Workspaces to the Rescue

The solution for me, obvious in hindsight, is just to use a less typical Yarn Workspace workflow: have two monorepos in the same yarn controlled parent.

I guess you'd just say that having two monorepos inside the same folder. Each with it's own repository (one public and one private).

Here's what it looks like in practice:

![](https://fiction-com.s3.us-west-1.amazonaws.com/5df935b4982d4c002c6b4bb7.jpeg)

### Config in Package.json

So as in above, all we need is a "Yarn Workspace wrapper" around our two monorepos (which are individually tracked with Git).

Yarn Workspaces are really good at tracking and de-duping dependencies and ultimately store everything in `node_modules` at the root of the wrapper.

All you need to do is add the following to the package.json in the wrapper root:

```
workspaces: ['@public-monorepo/*', '@private-monorepo/*']
```

And from there it should all work out.

## Summary

The goal here was to hopefully save somebody some time. This specific structure might not be for everybody, but it's working for us.
