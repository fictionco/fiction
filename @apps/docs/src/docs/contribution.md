# Contributing to Factor

**Any contribution to Factor is more than welcome.** Below we provide some specific technical guidance as well as some philosophy and style guidelines.

## Getting started

1. [Fork](https://help.github.com/articles/fork-a-repo/) the [Factor monorepo](https://github.com/fiction-com/factor) to your own account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Run `npm install` or `yarn install` to install the dependencies.
3. Factor is running in a Monorepo configuration. Using [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna). (Make sure to read about the concepts behind these tools.)
4. Run the monorepo (shown below)
5. Follow the [Github Flow](https://guides.github.com/introduction/flow/) and [Feature Branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) workflow.

> Note that you should be running the latest Yarn utility and Node version 10 or above.

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

### Basic Flow

The typical and reconmended way of getting changes made is by making a pull request from a feature branch which includes your changes or fixes.

The workflow looks like this:

- Fork the Factor Monorepo
- Create a new branch for your specific changes (e.g. branch named: fix/some-bug/issue321)
- Create pull request discussing reasons for change
- If you're request is reasonable, then we may request code refactoring via code review or accept your pull request as is.

## Testing

(Coming Soon)

## Linting

As you might have noticed already, we are using ESLint to enforce a code standard. Please run `yarn factor lint` before committing
your changes to verify that the code style is correct. If not, you can use `yarn factor lint --fix`. If there are still errors left, you must correct them manually.

## Documentation

If you are adding a new feature, or changing behavior you'll likely want to document the changes.

Please do so with a change to the [docs](https://github.com/fiction-com/factor/tree/master/%40apps/docs) package inside the Factor repo.

No need to write documentation up immediately but please do so whenever your change is made stable and ready for production.
