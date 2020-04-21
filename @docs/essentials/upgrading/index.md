---
title: Upgrading
description: How to upgrade Factor to the latest version.
---

# Upgrading Factor 

Upgrading Factor is easy. Normally it just involves upgrading your packages, but there are sometimes caveats. 

## Before You Upgrade 

- Factor follows the [semver](https://semver.org/) standard for releases. All upgrades should be considered non-breaking, unless they are major updates; (and even then changes are typically minor breaking changes.)
- Before you upgrade, you may want to reference the [changelog](./changelog). This may explain any issues or functionality that may change once you've upgraded.

## Upgrading with Yarn 

```bash
yarn upgrade
```

Yarn typically does a better job than NPM of maintaining package consistency. However, if you run into issues, we recommend: 

1. Delete `yarn.lock`
2. Delete `node_modules` folder
3. Run `yarn`

## Consistent Upgrading with NPM 

1. Delete `package.lock`
2. Delete `node_modules` folder
3. Run `npm install`

```bash
npm install 
```

## Updating in Package.json

Your `package.json` file is what specifies which version of Factor and its plugins should be installed. You can also manually update versions there if you prefer. 

> **Understanding ^ in versions** 
> Most versions in `package.json` use the (^) "caret" marker. This specifies that the package should be upgraded unless the package is a major release. Since major releases are the only "breaking" releases, this is why using the (^) makes sense
