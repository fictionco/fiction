# Factor Components

Adding all the custom components you'd like to your app is a straight-forward process. There are two primary methods for including custom components throughout your views. 
- Add a global component using the `components` filter
- Import a component relatively using a dynamic import 

### Global Components

It's possible to add components globally to your app so they are available without having to specifically import them. To do this, we just use Factor's components filter: 

```javascript
// index.js
export default Factor => {
  constructor(){
    this.addComponents()
  }
  addComponents(){
    Factor.$filters.add("components", components => {
      // Adds the file ./my-component.vue as a globally available component
      // Available in your templates using <my-component /> 
      components["my-component"] = () => import("./my-component")
      return components
    })
  }
}
```

### Relative Components

To only require components from within other components, you can use a simple dynamic import inside Vue's components property: 
```javascript
// the file './my-component.vue' will be available in THIS component's template as  <my-component /> 
components: {
  'my-component': () => import('./my-component')
}
```