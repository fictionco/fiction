---
title: Using Pro and Business Suites
description: Learn how to setup and use the pro and business Factor suites
---

# Pro and Business Suites

While Factor's core platform is 100% free, you can upgrade it to enable premium features via Factor's pro and business extension suites.

In addition to premium support and services, [the pro suites](https://factor.dev/pro) enable special "pro" functionality in the dashboard, plugins and themes.

In this guide we'll discuss how to upgrade your app to pro or business. Also we'll cover what happens if you'd like to downgrade or cancel any paid plan.

## Connecting Your Factor API User

When you sign up for an account at [Factor.dev](https://factor.dev) you'll be given a development API key. To get your key, go to your [development page](https://factor.dev/dashboard/developer) in the Factor.dev dashboard.

![Development Dashboard](./development-dashboard.jpg)

Once you have your key, add it to your environmental variables under `FACTOR_API_KEY`:

```bash
# env
FACTOR_API_KEY="---YOUR API KEY---"
```

Now whenever you start your Factor server, it will ping the API server and if you have purchased or enabled a premium suite Factor will enable your app.

![Premium Detected](./cli-output.jpg)

What's next? That's it! Now Factor knows that you are a premium customer and can adjust things accordingly.

## What happens when a premium suite is enabled

When Factor detects that it is running the pro or business (which includes pro) suite it enables varying features in extensions created by the core team.

Each plugin has different features that can be enabled, typical examples include:

- Sitemap support
- @-replies or commenting features
- Responsive enhancements
- Additional data or categories
- Search support
- etc...

The best way to know specific features that are enabled on plugin-by-plugin basis is to reference their docs or dashboard interface.

## What happens if you cancel

When you cancel, Factor will never break your live site. The features enabled by pro/business are carefully selected to be unobtrusive and your visitors won't notice any difference.

If you'd like to cancel and support the features on your own, for example adding forum posts to the sitemap, that is up to you.

The pro and business suites are solution to sustainability of the core Factor platform. Thanks for your business!
