---
title: Basic Installation
description: Learn how to install on your website or application using HTML or a tag manager.
---

Once you've created your account and setup your organization and site, it's time to install the tracking script. The script is installed in the typical fashion, using an HTML snippet, that can be added via your code or with a tag manager.

## Getting Your Tracking Snippet

The tracking snippet looks like this:

```js
<script src="https://s.kaption.net/YOUR_SITE_ID.js"></script>
```

Your projectId and tracking script will be generated for you once you've logged in and created an organization with a site.

If you've done this, you should be able to see your tracking script at [this url](https://app.kaption.co/site/_id_/code).

## Installing the Snippet

To install this script, all you need to do is add it to the HTML of your website. Which means you can either "hard-code" it by adding it directly to your HTML, or you can use a tag manager. Tag managers, like GTM, have become a common way of managing and coordinating various marketing tags on websites.

### Installing for Capability (AB Testing)

If you plan on using [AB testing and analytics](https://www.kaption.co/features/ab) then you should install the snippet on the top of your site's HTML. The reason for this is because this allows the script to perform text and UI replacement before the page loads for the end user.

As the script is served by a world class static hosting CDN (Amazon AWS), there should be little concern about loading performance and implications on performance. However, if performance is a concern, you may want to install the script via your site's body.

### Installing for Performance

If you want to minimize the loading considerations for the script, you can install it in the body of your site, before the footer. This is how tag managers will load it by default.

Alternatively, you can add a `defer` attribute to the tag as follows:

```js
<script src="https://s.kaption.net/YOUR_SITE_ID.js" defer></script>
```

### Recommendation

The tracking script uses [AWS to host and serve](https://aws.amazon.com/cloudfront/) the tracking script globally. It is also optimized for rapid loading. In most cases we recommend installing the script without a tag manager (which forces the script to the footer) and in the `head` of your HTML. This will give you the best experience possible.

## Installation Guides

If you still have some questions on how the tracking script should be installed using your favorite website creation tool, we've prepared some [installation guides](https://www.kaption.co/docs/installation-guides) for popular tools.
