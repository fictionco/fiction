---
title: Developer API - Tracking Events
description: Tracking custom events with Darwin's API
---

Within Darwin's API, the `track` call is how you can record a specific custom event.

With this call you can also add additional information to describe the event called `properties`.

## Events and Darwin

The basic unit of measurement inside Darwin, and any analytics system, is an event.

In the browser, Darwin tracks common events in a performance oriented way. Like pageviews and clicks and other behavioral metrics.

However, this won't cover all use cases for a comprehensive analytics setup. And for that, we have the `track` API.

## Tracking Events

Tracking events just requires the use the `track` method. You can add additional information under the `properties` field. Within properties, you can add any information you'd like but there are some reserved and standardized fields for common data.

```js
darwinClient.track("Watched Video", { title: "Darwin Analytics API" })
```

## Best Practices

Every custom event represents a singular action. Naming can be a challenge when it comes to custom events but there are best practices:

- Use a noun (e.g. page) and a past-tense verb (e.g. viewed): `Page Viewed`. This will help you and your team understand the meaning without too much overhead.

## Properties

Outside of the common information automatically inferred by Darwin, you may want to attach custom information to any event you trigger via API.

That is what the `properties` field is there for.

### General Standardized Properties

<elem-table fields="properties"></elem-table>
