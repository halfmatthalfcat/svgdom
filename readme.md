# svgdom-cf

This is a fork of the original `svgdotjs/svgdom` that is compatible with running in Cloudflare Workers.
It removes many of the non-supported Node API depdencies and replaces them with CF Worker compabile
alternatives, namely around image sizing and font handling.

## Install

```
npm install @halfmatthalfcat/svgdom-cf
```

## Fonts

To utilize fonts, you **must** load your own fonts into `svgdom`, there are no default fonts. If you do not, any usage of fonts will essentially noop and throw console warnings.

Instead of the original way of loading fonts from the file system, this fork of `svgdom` acceps a map of
font family -> font Buffers to use at runtime.

Cloudflare allows you to import and bundle raw data files when deploying Workers. You can do this by
configuring your `wrangler.toml` to allow imported file types of certain extensions to be bundled as Buffers via:

```toml
rules = [
  { type = "Data", globs = ["**/*.woff2"], fallthrough = true }
]
```

### Supported Font Types

Font loading is controlled by the [fontkit library](https://github.com/foliojs/fontkit/blob/master/src/index.js). It supports:

* TIFF
* WOFF
* WOFF2
* TrueType
* DFont

### Setting Fonts

In your CF Worker, you will want to import and load the fonts **outside of your handler** to cache between
invocations.

```js
import { setFonts } from "@halfmatthalfcat/svgdom-cf";

import Ariel from "./ariel.woff2";
import TimesNewRoman from "./tnr.tiff";

setFonts({
  Ariel,
  TimesNewRoman,
});


export default {
  fetch() {
    // CF fetch handler
  }
}
```

### Usage

You typically don't use `svgdom` alone, but with `SVG.js` to actually build SVGs. Luckily, there is a
companion library `@halfmatthalfcat/svgals` that combines this library, a modified `SVG.js` and the usage
of AsyncLocalStorage to efficiently build SVGs to serve in Workers.

Check out the [@halfmatthalfcat/svg-cf](https://github.com/halfmatthalfcat/svg-cf) project for more info.

## Limitations
Almost all functions of svg.js work properly with svgdom. However there are a few known limitations:

- font properties like bold, italic... are only supported when you explicitely load that font e.g.
    ```js
    setFontFamilyMappings({'Arial-italic': 'arial_italic.ttf'})
    ```
- `querySelector` only supports the following pseudo classes:
    - `first-child`
    - `last-child`
    - `nth-child`
    - `nth-last-child`
    - `first-of-type`
    - `last-of-type`
    - `nth-of-type`
    - `nth-last-of-type`
    - `only-child`
    - `only-of-type`
    - `root`
    - `not`
    - `matches`
    - `scope`
- special chars in attribute values: `#` and `.` are allowed but things like `:` or `[]` will break the selector
