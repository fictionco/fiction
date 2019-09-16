# Philosophy and Style

## Rules To Live By

Factor follows [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) regarding the way it's developed. This can be summarized by the following:

- **Each module should do one thing well.** For something new, start a new module instead of adding new features.
- **Portability over efficiency.** Modular code that can be removed or included stand-alone (e.g. in a test) is more important than concepts like DRY.
- **Small and opinionated over options and features.** Parts of the Factor program should strive to be as small in size and scope as possible. Options should be removed in favor of elegant defaults.
- **Code for fewer special cases.** Strive to code in a way that doesn't require special cases (i.e. if/else's).
  Read [Linus stack on "Good Taste" in code &rarr;](https://medium.com/@bartobri/applying-the-linus-tarvolds-good-taste-coding-requirement-99749f37684a)
