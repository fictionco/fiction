# Contributing to Factor

## Development Philosophy

Factor follows [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) regarding the way it's developed. This can be summarized by the following:

- **Each module should do one thing well.** For something new, start a new module instead of adding new features.
- **Portability over efficiency.** Modular code that can be removed or included stand-alone (e.g. in a test) is more important than concepts like DRY.
- **Small and opinionated over options and features.** Parts of the Factor program should strive to be as small in size and scope as possible. Options should be removed in favor of elegant defaults.
- **Code for fewer special cases.** Strive to code in a way that doesn't require special cases (i.e. if/else's).
  Read [Linus stack on "Good Taste" in code &rarr;](https://medium.com/@bartobri/applying-the-linus-tarvolds-good-taste-coding-requirement-99749f37684a)

## Workflow

Factor code is hosted on [Github](https://github.com/fiction-com/factor).

### Concepts

- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna)
- [Github Flow](https://guides.github.com/introduction/flow/) and [Feature Branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)

### Running Apps Using the Monorepo

If you'd like to try running apps or themes directly from the [Factor monorepo](https://github.com/fiction-com/factor) that is easy.

First clone it:

```bash
$ git clone https://github.com/fiction-com/factor
```

And then running a [Yarn workspace](https://yarnpkg.com/lang/en/docs/workspaces/) within the repo. As an example, you can run this site's code with the following command:

```bash
$ yarn workspace @apps/docs factor dev
```

### Getting Code Into Core

There are many ways of getting code into core. The typical and reconmended way of getting changes made is by making a pull request from a feature branch which includes your changes or fixes.

The workflow looks like this:

- Fork the Factor Monorepo
- Create a new branch for your specific changes (e.g. branch named: fix/some-bug/issue321)
- Create pull request discussing reasons for change
- If you're request is reasonable, then we may request code refactoring via code review or accept your pull request as is.
