/**
 * Factor Settings - How settings work in Factor...
 *
 * Your settings files are how you customize themes and plugins.
 * They allow you to set text and images, but also override components, routes and more.
 *
 * All you need to do is export an object containing all your settings to override the settings files in extensions
 *
 * @example
 * In a theme factor-settings:
 *
 * export default {
 *    home: {
 *      header: "Theme Header"
 *    }
 * }
 *
 * You would override this with your own settings here:
 * export default {
 *    home: {
 *      header: "My Custom Header"
 *    }
 * }
 *
 */
export default {}
