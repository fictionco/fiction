---
title: Form UI Elements
description: A reference for form UI elements available for Factor apps
---

# Form UI Elements

Factor includes several form UI elements that can be used for common tasks.

## Using Elements

All elements are made available from the `@factor/ui` module. Import them and then use them as Vue components.

## Input Wrapper

#### Purpose
Loads Font Awesome and displays an icon. Free version only and loads max once per page.
#### Props
```yaml 
- icon(string): A Font Awesome icon class
```
#### To Import
```js
import { factorIcon } from "@factor/ui"
```
#### In Template
```html
<factor-icon icon="fas fa-key" />
<factor-icon icon="far fa-trash-alt" />
<factor-icon icon="fas fa-map-marker-alt" />
<factor-icon icon="fas fa-camera x2" />
<factor-icon icon="fas fa-times x2" />
<factor-icon icon="fas fa-plus-square x2" />
```
#### Rendered
<component class="inject-component" id="docsEngine.components.icon"></component>

## Rich Editor

## Image Upload

## Sortable

## Tags

## Select

## Date

## Birthday

## Checkbox

## Text, Email, Password, Phone, Textarea
