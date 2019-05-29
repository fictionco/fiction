<p align="center">
  <img src="./factor.svg" width="350" style="width: 350px;display:block;">
  </p>
 <p align="center">
  <a href="https://gitter.im/factorjs/community"><img src="https://badgen.net/badge/chat/on%20Gitter" alt="Gitter"></a>
  <a href="https://gitter.im/factorjs/community"><img src="https://badgen.net/badge/license/GPL/blue" alt="GPL"></a>
  <a href="https://gitter.im/factorjs/community"><img src="https://badgen.net/badge/license/GPL/blue" alt="GPL"></a>
 </p>

> A Javascript web-OS for shipping production web apps. Build a fully functional web app, blog or PWA (progressive-web-app) **Get started in less than 5 minutes.**

## Links

- 📘 Documentation: [https://factor.dev](https://factor.dev)
- 🎬 Video: [Quick demo](https://www.youtube.com/channel/UCQ8sF_omtjTrptpm3Smnx3w)
- 💬 Chat: [Gitter](https://gitter.im/factorjs/community)
- 🌟 [AwesomeFactor](https://awesome.factor.dev/)

## Features

- Add Plugins, Themes, Stacks as easy as `yarn add [extension]`
- Ship Production Apps Faster 
- 100% Javascript Stack
- A Powerful CMS Framework (Optional)
  - Dashboard
  - Markdown Page and Post Editing System  
  - Authentication, Image Management, DB


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


## Contributors
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/arpowers"><img src="https://avatars2.githubusercontent.com/u/308134?s=460&v=4" width="120px;" alt="Andrew Powers"/><br /><sub><b>Andrew Powers</b></sub></a><br /><a href="https://github.com/fiction-com/factor/issues?q=author%3Aarpowers" title="Bug reports">🐛</a> <a href="https://github.com/fiction-com/factor/commits?author=arpowers" title="Code">💻</a> <a href="https://github.com/fiction-com/factor/commits?author=arpowers" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/finestpixels"><img src="https://avatars3.githubusercontent.com/u/2752967?s=460&v=4" width="120px;" alt="Raymond Aleman"/><br /><sub><b>Raymond Aleman</b></sub></a><br /><a href="#design-finestpixels" title="Design">🎨</a> <a href="https://github.com/fiction-com/factor/commits?author=finestpixels" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributing

Please refer to our [Contribution Guide](https://factor.dev/contribution)


## Security

If you discover a security vulnerability regarding Factor, please send an e-mail to the team via letters@fiction.com! All security vulnerabilities will be promptly addressed.

## License

[GNU](https://github.com/fiction-com/factor/blob/master/LICENSE)
