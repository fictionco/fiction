---
title: Darwin Analytics and BigCommerce Step-by-step Installation Guide
description: Add the Darwin tracking code on a website built and hosted with BigCommerce
---

## Before You Start

To add the Darwin tracking code to your [BigCommerce](https://www.bigcommerce.com/) website, you need to use https. If you don't have SSL, the Darwin tracking code won't work right. Here is their guide on [installing an SSL certificate on BigCommerce](https://support.bigcommerce.com/s/article/BigCommerce-SSL-Certificate#install).

### Get Tracking Code

Login to [Darwin's Dashboard](https://app.darwin.so/login) and visit "Tracking Code" in the navigation.

![Tracking Code](../install2.webp "Darwin - Tracking Code")

Copy the tracking code HTML that you'll find there.

![Copy Tracking Code](../install3.webp "Darwin - Copy Tracking Code")

### Visit BigCommerce Dashboard

[Login to BigCommerce](https://login.bigcommerce.com/) and go to "Storefront".

![Storefront](./bigcommerce1.webp "BigCommerce - Storefront")

### Add Custom Code

Go to "Script Manager" page.

![Script Manager](./bigcommerce2.webp "BigCommerce - Script Manager")

Click "Create a Script" button.

![Create a Script](./bigcommerce3.webp "BigCommerce - Create a Script")

Once there, run through the following:

- Type in "Darwin Analytics" into Name of Script
- Description can be anything or left blank.
- Select "Location on Page: Head"
- Choose "Select pages where script will be added: All Pages" method
- Select "Script Category: Analytics"
- Paste your tracking code inside the "Script Contents" textarea.
- Save Changes

![Add Tracking Code](./bigcommerce4.webp "BigCommerce - Add Tracking Code")

### Verify Installation.

Once you've saved your changes, you can verify your install on the [Darwin dashboard](https://app.darwin.so).

![Verify Tracking Code](../install5.webp "Darwin - Verify Tracking Code")
