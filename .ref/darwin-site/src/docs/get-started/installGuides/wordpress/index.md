---
title: Darwin Analytics and WordPress Step-by-step Installation Guide
description: Add the Darwin Tracking Code to your WordPress site
---

# Install on WordPress

### Before You Start

The Darwin tracking code can be installed on [Wordpress.com](https://wordpress.com/) Business plan and self-hosted versions of Wordpress from ([Wordpress.org](https://wordpress.org/)).

Darwin isn't available for users on a [Wordpress.com](https://wordpress.com/) free or personal plan since you cannot add Custom HTML or install plugins on these plans.

### Get Tracking Code

Login to [Darwin's Dashboard](https://app.darwin.so/login) and visit "Tracking Code" in the navigation.

![Tracking Code](../install2.webp "Darwin - Tracking Code")

Copy the tracking code HTML that you'll find there.

![Copy Tracking Code](../install3.webp "Darwin - Copy Tracking Code")

### Visit WordPress Dashboard

Login to WordPress dashboard and go to "Appearance > Editor" in the navigation.

![Editor](./wordpress1.webp "WordPress - Editor")

### Add Custom Code

Find your "Theme Header" (header.php) file and open it.

![Theme Header](./wordpress2.webp "WordPress - Theme Header")

Add the tracking code in this file before `</head>` closing tag and save changes.

![Add Tracking Code](./wordpress3.webp "WordPress - Add Tracking Code")

**Things that you should be aware of:**

- You’ve added tracking code to your theme. If you change your theme, you will have to add the tracking code again.
- You may need to clear cache to see changes in your theme.

### Verify Installation.

Once you've saved your changes, you can verify your install on the [Darwin dashboard](https://app.darwin.so).

![Verify Tracking Code](../install5.webp "Darwin - Verify Tracking Code")
