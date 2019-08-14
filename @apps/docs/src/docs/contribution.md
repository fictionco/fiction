# Contributing to Factor

## Running Apps Using the Monorepo

If you'd like to try running apps or themes directly from the [Factor monorepo](https://github.com/fiction-com/factor) that is easy.

First clone it:

```bash
$ git clone https://github.com/fiction-com/factor
```

And then running a [Yarn workspace](https://yarnpkg.com/lang/en/docs/workspaces/) within the repo. As an example, you can run this site's code with the following command:

```bash
$ yarn workspace @apps/docs factor dev
```
