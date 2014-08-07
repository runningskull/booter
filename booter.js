/** Big ups to https://github.com/olark/lightningjs for
 *  figuring out some of the trickier cross-browser stuff!
 **/

;(function() {

var booter = {}
  , frames = {}

// Strings defined here to improve compressability
var DOC = 'document'
  , BODY = 'body'
  , APPEND = 'appendChild'
  , CREATE = 'createElement'
  , SRC = 'src'
  , DIV = 'div'
  , CWIN = 'contentWindow'


function isArray(x) {
  return Object.prototype.toString.call(x) == '[object Array]'
}


// Params:
//  - url: full or relative URL of script to load inside iframe
//  - globalExports: which globals to pull out of the iframe
//  - silent: return exported globals, but don't attach to parent window
booter.loadScript = function(url, globalExports, cb) {
  var frame, pending={}
    , urls = typeof url === 'object' ? url : [url]

  if (! isArray(globalExports)) globalExports = [globalExports];

  function buildIframeHTML() {
    return ['<head></head><',BODY,' onload="', buildOnLoad(), '"></', BODY, '>'].join('')
  }

  function buildOnLoad() {
    var prefix = ['var d=', DOC, ',h=d.getElementsByTagName(\'head\')[0];']
    for (var i = 0; i < urls.length; i++)
      prefix = prefix.concat(['h.',APPEND,'(d.',CREATE,'(\'script\')).', SRC, '=\'', urls[i], '\';'])
    return prefix.join('')
  }

  function loadScriptInsideFrame() {
    // try to get a handle on the body. If we can't, try again in a bit
    var body = document[BODY]
    if (!body) return setTimeout(loadScriptInsideFrame, 100)

    var frameWrapper = document[CREATE](DIV)
      , frameContainer = frameWrapper[APPEND](document[CREATE](DIV))
      , domainSrc

    frame = document[CREATE]('iframe')

    frameWrapper.style.display = 'none'
    body.insertBefore(frameWrapper, body.firstChild)
    frame.frameBorder = "0"

    // Otherwise we'll get security warnings in IE6 on SSL pages
    if (/MSIE[ ]+6/.test(navigator.userAgent))
      frame[SRC] = 'javascript:false';

    frame.allowTransparency = 'true'
    frameContainer[APPEND](frame)

    // Try to start writing into the blank iframe. In IE, this will fail if
    // the document.domain has been set, so fall back to using a javascript src
    // for the frame. In IE > 6, these URL's will normally prevent the window
    // from triggering 'onload', so we only use the javascript URL to open the
    // document and set its document.domain
    try {
      frame[CWIN][DOC].open()
    } catch(ex) {
      domainSrc = 'javascript:var d=' + DOC + ".open();d.domain='" + document.domain + "';"
      frame[SRC] = domainSrc + 'void(0);'
    }

    // Set the HTML of the iframe. In IE 6, the document.domain from the iframe
    // src hasn't had time to 'settle', so trying to access the contentDocument
    // will throw an error. Luckily, in IE 7, we can finish writing the HTML
    // with the iframe src without preventing the page from 'onload'ing
    try {
      var frameDocument = frame[CWIN][DOC]
      frameDocument.write(buildIframeHTML())
      frameDocument.close()
    } catch(ex) {
      frame[SRC] = domainSrc + 'd.write("'
                   + buildIframeHTML().replace(/"/g, String.fromCharCode(92) + '"')
                   + '");d.close();'
    }

    var script = frame[CWIN][DOC].getElementsByTagName('script')[0]
    script.addEventListener
      ? script.addEventListener('load', exportGlobals)
      : script.attachEvent('onload', exportGlobals)
  }

  function exportGlobals() {
    var globs = []
    for (var i=0, len=globalExports.length; i<len; i++) {
      var key=globalExports[i], value=frame[CWIN][key]
      globs.push(value)
      pending._globals.push(value)

      if (!cb)
        window[key] = value;
    }
    cb && cb.apply(null, globs)
  }

  pending._globals = []
  loadScriptInsideFrame()
  return pending
}


if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = booter.loadScript;
  }
} else {
  window.booter = booter
}


}());

