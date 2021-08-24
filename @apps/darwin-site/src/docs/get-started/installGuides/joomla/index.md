---
title: Darwin Analytics and Joomla Step-by-step Installation Guide
description: Add the Darwin Tracking Code to your Joomla site
---

# Install on Joomla

### Before You Start

This guide was written for [Joomla](https://www.joomla.org/) 3.9.27 Stable, using the Protostar theme. If you notice anything different from this guide when you are in your Joomla admin panel, let us know on the [support page](/support).

### Get Tracking Code

Login to [Darwin's Dashboard](https://app.darwin.so/login) and visit "Tracking Code" in the navigation.

![Tracking Code](../install2.webp "Darwin - Tracking Code")

Copy the tracking code HTML that you'll find there.

![Copy Tracking Code](../install3.webp "Darwin - Copy Tracking Code")

### Visit Joomla Admin Panel

Login to the Joomla admin panel and go to "Extensions > Templates > Templates".

![Templates](./joomla1.webp "Joomla - Templates")

### Add Tracking Code

Click on the title of the template your site is using.

![Current Template](./joomla2.webp "Joomla - Current Template")

Locate and open the file that contains the `<head>` tag, usually the `index.php` file.

The `<head>` tag might be in a different file other than `index.php` in your theme. If in doubt, consult the documentation of your theme, or contact the theme creator.

![<head> Tag](./joomla3.webp "Joomla - <head> Tag")

Add the tracking code in this file before `</head>` closing tag and save changes.

![Add Tracking Code](./joomla4.webp "Joomla - Add Tracking Code")

### Verify Installation.

Once you've saved your changes, you can verify your install on the [Darwin dashboard](https://app.darwin.so).

![Verify Tracking Code](../install5.webp "Darwin - Verify Tracking Code")
