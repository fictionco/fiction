![Fiction](./factor.svg)

<p align="center">
  <a href="https://gitter.im/fiction-com/community"><img src="https://badgen.net/badge/chat/on%20Gitter" alt="Discord"></a>
 </p>

> Serverless CMS designed to help you start a fully functional website, blog or PWA (progressive-web-app) *within 5 minutes*.

> How? Factor is a hot-swappable plugin system based on NPM that allows you to install and configure plugins without writing any code.

## Links

- 📘 Documentation: [https://factor.dev](https://factor.dev)
- 🎬 Video: [Quick demo](https://www.youtube.com/channel/UCQ8sF_omtjTrptpm3Smnx3w)
- 💬 Chat: [Gitter](https://gitter.im/fiction-com/community)
- 🌟 [AwesomeFactor](https://awesome.factor.dev/)

## Features

- Static Hosting – Build apps that handle production-ready traffic without having to provide servers, or pay for resources that go unused.
- 100% JavaScript – One language to rule them all.
- NPM Plugins – Add functionality with plugins, include only what you need, and avoid any bloat.
- Vue / Reactive Components – Customize your front-end layout with vue.js single-file components.
- Infinite Scalability – Infinitely scalable with serverless builds out of the box. Get rid of large server request and save money.
- Faster Development – Launch serverless applications at record speed and low cost.

Learn more at [factor.dev](https://factor.dev).


## Getting started

```
$ yarn factor <project-name>
```

It's as simple as that!

## Themes
Start by using the basic Factor app [starter theme](#starter-theme-url)

## Examples

Please take a look at https://factor.dev/examples

## Production deployment

To deploy, instead of running factor, you probably want to build ahead of time. Therefore, building and starting are separate commands:

```bash
code code code
```

For example, to deploy with [`now`](https://zeit.co/now) a `package.json` like follows is recommended:
```json
{
  "name": "my-app",
  "dependencies": {
    "factor": "latest"
  },
  "scripts": {
    "dev": "factor",
    "build": "factor build",
    "start": "factor start"
  }
}
```

Then run `now` and enjoy!

Note: we recommend putting `.factor` in `.npmignore` or `.gitignore`.

## Core team
Team will go here

## Contributors
Contributors will go here

## Contributing

Please refer to our [Contribution Guide](https://factor.fiction.com/guide/contribution)


## Security

If you discover a security vulnerability regarding Factor, please send an e-mail to the team via letters@fiction.com! All security vulnerabilities will be promptly addressed.

## License

[GNU](https://github.com/fiction-com/factor/blob/master/LICENSE)