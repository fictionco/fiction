---
title: Developer API and Specification
description: Learn how to build custom event tracking with Darwin API.
---

Darwin's API is meant to be a comprehensive yet simple way of capturing information about your users and visitors. It is based on [Segment.com](https://segment.com/docs/connections/spec/)'s specification and therefore should be compatible for any code meant for Segment with minimal changes.

## Darwin's API Structure

There are three parts to Darwin's API specification.

- **The API Methods** There are a few different API methods for different purposes. Specifically tracking events, identifying users, and grouping users.
- **Common Data and Standards** The standards for data that is attached to events or recommended when doing common tasks like eCommerce tracking.
- **Recommended Tracking Approach** This is the events we recommend you track for a particular industry based on our experience. With proper structure, we can map these events to particular features within end destinations like Google Analytics and Facebook Ads.

## Installing The Client

The first step to using Darwin's API is to get the client [installed on your website](./client) via module or tracker global.

## The API

- [Common Data](./common-fields) - The data that can be passed in as "context" for any request.
- [Identification](./identification) - Track customers and users by ID.
- [Custom Event Tracking](./track) - Trigger custom events based on behaviors in your site or app.
- [Grouping Users](./group)- Associate users with relevant groups or organizations in your site or app.
