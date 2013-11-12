booter
======

A tiny browser-side script loader designed to load scripts for embedded 
widgets that safely loads scripts inside an iframe and exposes globals
you select to the outer page.

## Usage options:

1. Copy/paste it into your loader script

2. Load the file
```html
<script src="/path/to/booter.js"></script>
<script>booter.loadScript('//my-domain.com/js/my-larger-embedded-script.js')</script>
```

3. Using Browserify
```javascript
var loadScript = require('booter')
loadScript('//my-domain.com/js/my-larger-embedded-script.js')
```

## TODO:

- Better docs & explanation about what booter does right
- Set doctype on iframe?

