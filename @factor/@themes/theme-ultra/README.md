## How to use the Ultra theme

1. Go to `@apps/docs/package.json` in `dependencies` replace the default @theme for `"@factor/theme-ultra": "1.0.0-alpha.7"`
2. Go to `@apps/docs/.factor/loader-app.js` and add this line `files["ultra"] = require("@factor/theme-ultra").default`
3. Go to `@apps/docs/.factor/loader-server.js` and add this line `files["ultra"] = require("@factor/theme-ultra").default`
4. Go to `@apps/docs/.factor/loader-settings.js` and replace the default theme for the ultra theme if for example the default theme is `files["docs"] = require("@factor/theme-docs/src/theme-settings.js").default` remove that line of code and add this one `files["ultra"] = require("@factor/theme-ultra/src/theme-settings.js").default`
5. Finally run in your terminal `yarn workspace @apps/docs factor dev` and open the `http://localhost:3000/` in the browser.

Note: All the values are dynamic, you can change any value in the `@factor/@themes/theme-ultra/src/theme-settings.js` file.
