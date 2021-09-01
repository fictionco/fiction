---
title: Darwin Analytics and Shopify Step-by-step Installation Guide
description: Add the Darwin Tracking Code to your Shopify theme
---

# Install on Shopify

### Before You Start

The Darwin tracking code can be installed on your [Shopify](https://www.shopify.com/) theme but you can only track your Storefront and the "Order Confirmation" page because Shopify's default checkout pages block third-party scripts.

### Get Tracking Code

Login to [Darwin's Dashboard](https://app.darwin.so/login) and visit "Tracking Code" in the navigation.

![Tracking Code](../install2.webp "Darwin - Tracking Code")

Copy the tracking code HTML that you'll find there.

![Copy Tracking Code](../install3.webp "Darwin - Copy Tracking Code")

### Visit Shopify Dashboard

[Login to Shopify](https://accounts.shopify.com/) and go to "Online Store > Themes" on the navigation.

![Online Store > Themes](./shopify2.webp "Shopify - Online Store > Themes")

### Add Custom Code

Click on the "Actions" dropdown of your theme and select "Edit Code".

![Edit Code](./shopify3.webp "Shopify - Edit Code")

Under the "Layout" section, select "theme.liquid" file.

![theme.liquid](./shopify4.webp "Shopify - theme.liquid")

Scroll down the page until you find the following tag: **`</head>`**.

Some themes will use `{/head}`, `[/header]`, or other variations of `[/head]`. These will work the same way.

![Find </head> Tag](./shopify5.webp "Shopify - Find </head> Tag")

Add the tracking code in this file before `</head>` closing tag and save changes.

![Paste Tracking Code](./shopify6.webp "Shopify - Paste Tracking Code")

Click "Save and Publish" your theme to apply the changes.

The Darwin tracking code should now be installed on your Storefront.

### Track Order Confirmations

If you want to track order confirmations, you will need to install the tracking code in another section.

Click "Settings" on the navigation.

![Settings](./shopify7.webp "Shopify - Settings")

Click on "Checkout" link.

![Checkout](./shopify8.webp "Shopify - Checkout")

Scroll down until you reach the "Additional Scripts" field and add tracking code.

![Add Tracking Code](./shopify9.webp "Shopify - Add Tracking Code.")

### Verify Installation.

Once you've saved your changes, you can verify your install on the [Darwin dashboard](https://app.darwin.so).

![Verify Tracking Code](../install5.webp "Darwin - Verify Tracking Code")
