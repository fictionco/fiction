# Factor Server Analytics

This plugin adds tracking of server activity via Google Analytics.

## Install

```bash
yarn add @factor/plugin-server-analytics
```

## Settings

```js
// factor-settings.js
export default {
  serverAnalytics: {
    trackingId: "", // GA tracking ID - ua-xxxx-xx
    trackEndpointHits: true // Send endpoint request events (track each endpoint request)
  }
}
```

## Usage

### Tracking endpoint requests

By default this plugin will track endpoint requests with the following:

- **event**: 'endpointRequest'
- **action**: the `id` of the endpoint
- **method**: the method called

### Triggering Custom Server Events

To send a custom event, all that you need to do is send a get/post request to the `/__track_event__` endpoint.

The query parameters passed should event, action and/or label.

_Example:_

```js
import axios from "axios"

axios.get("/__track_event__?event=myEvent&action=theAction&label=theLabel")
```
