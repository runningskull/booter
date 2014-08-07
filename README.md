booter
======

A tiny browser-side script loader designed to load your 3rd-party, embedded
Javascript library inside a sandboxed iframe, and give you transparent access
to it on the parent page.

## Problem

You have some javascript code that someone else is going to embed in their
website. Maybe you're making a widget, or a JS library for your service.

Since [nearly] all of the global Javascript environment is modifiable, your
code is not guaranteed to run in a sane environment. In fact, it's almost
guaranteed that it will frequently be run in an environment that's been hacked
& slashed so much that it breaks your code.

## Solution to Problem

Run your code inside an iframe! This gives you a clean sandboxed environment
in which to run your code. If you set it up right, you can call
functions directly, you can interact with your inside-the-iframe code so transparently,
you'll never know it's inside an iframe. That's what `booter` does.

### DIY: Not as Simple as it "Should Be"

Doing this can be trickier than it seems. Old & crappy browsers do strange things to
iframes, and you need to jump through some hoops to ensure sanity when communicating
between iframe & parent page.

### Booter Makes it Simple

Inside your tiny `load.js` file:

```javascript
var loadScript = require('booter')  // using browserify. for other options, see below.

// Your library, my-lib.js exposes its interface via a global variable: `window.MYLIB`
// (for example, twitter's library exposes `window.twttr` & facebook's exposes `window.FB`)

// Tell booter which globals you want, and provide a callback.
// Booter will load your code inside a sandboxed iframe, and pass you the globals.
loadScript('//my-domain.com/js/my-lib.js', ['MYLIB'], onReady)

function onReady(my_lib) {
    // `my_lib` is the interface exported by my-lib.js
    // Now you can make it available to your end-user by doing ie.

    window.MYLIB = my_lib

    // NOTE: If this is all you want to do, you can simply not pass a callback to
    // loadScript(), and booter will attach them to the parent window for you.

    // You might do other setup-y things here. Like...
    my_lib.init()   // or whatever ;-)
}
```

When you (or your end-user) call any method on MYLIB, that method will
be executed in the sandboxed iframe context. There are no restrictions
on what you can pass to exposed function. For example, you can pass
parent-page DOM nodes to an exposed function with no worries. Outside a
few contrived examples, you'll never notice or care that it's in an iframe.

<hr>


# Usage:

### Using Browserify
```javascript
// inside your load.js
var loadScript = require('booter')
loadScript('//my-domain.com/js/my-lib.js')
```

You can also load multiple scripts at a time
```
loadScript(['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', '//my-domain.com/js/my-lib.js'])
```

### Using a &lt;script> tag
```html
<!-- embedded directly into the end-user's page -->
<script src="//cdn.my-site.com/path/to/booter.js"></script>
<script>booter.loadScript('//my-site.com/js/my-lib.js')</script>
```

### Copy/pasting
You can copy/paste it directly into your `load.js` script (not recommended, but it's small enough that you could if you wanted)


## TODO:

- Add automated cross-browser tests with zuul & sauce labs
- Set doctype on iframe?

