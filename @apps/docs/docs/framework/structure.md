## App File Structure

When working with Factor apps it's important to know the standard file structure for a Factor app, as well as how it relates to Factor modules and so on. 

```yaml

- App/
  - package.json
  - factor-config.json # public configuration
  - factor-secrets.json # top-secret configuration (don't commit)
  - src/ # source
    - (components, css, imgs)
    - index.js # entry file
    - settings.js # theme customization file
    - static/ # static files e.g. favicon
  - .factor/  # generated files
  - dist/ # built files
  - node_modules 
    - @factor/ # factor modules are installed here 
      - (themes, plugins, stacks)

```
## Apps vs Themes

Apps and themes follow the exact same structure and are designed to be interchangeable. Meaning, a Factor app can be a theme and a them can be an app. 

This makes it easy to: 
- Use a theme as the starting point for an app, 
- Distribute an app you've built as a theme for others

#### Overriding

When an app is 'using' a theme, that means that the app has installed the theme as a dependency. From here, Factor loads the theme files first and then overrides them with files and config from your app. 

So if you'd like to completely customize a file from a theme, like a component, just copy it and place it in the same place within your app directory. 

```yaml
# If your app has the same component as the theme, it will override the theme's version of it:
- app/src
  - component.vue # takes precedence

- theme/src
  - component.vue
  - other-component.vue
```

Factor also uses a special overriding indicator `#` that is used when requiring modules. That tells Factor to look down the overriding hierarchy to find the component.

So if you include a component with the following request: 
```javascript
components: {
  'my-component': () => import('#/my-component')
}

// Order of priority: 
  // app
  // theme
  // relative file (replaces with a '.')
  // fallback
```