;(function(window, document) {

if (!! window.booter) return;
window.booter = {}


// Strings defined here to improve compressability
var DOC = 'document'
  , BODY = 'body'
  , APPEND = 'appendChild'
  , CREATE = 'createElement'
  , SRC = 'src'
  , DIV = 'div'
  , CWIN = 'contentWindow'


booter.loadScript = function(url) {
  function buildIframeHTML() {
    return [
      '<head></head><',BODY,' onload="var d=', DOC,
      ';d.getElementsByTagName(\'head\')[0].', APPEND, 
      '(d.', CREATE, '(\'script\')).', SRC, '=\'', url,
      "'\"></",BODY,">"
    ].join('')
  }

  function loadScriptInsideFrame() {
    // try to get a handle on the body. If we can't, try again in a bit
    console.log('000', document, body)
    var body = document[BODY]
    if (!body) return setTimeout(loadScriptInsideFrame, 100)

    var frameWrapper = document[CREATE](DIV)
      , frameContainer = frameWrapper[APPEND](document[CREATE](DIV))
      , frame = document[CREATE]('iframe')
      , domainSrc

    console.log(111)
    frameWrapper.style.display = 'none'
    body.insertBefore(frameWrapper, body.firstChild)
    frame.frameBorder = "0"

    // Otherwise we'll get security warnings in IE6 on SSL pages
    console.log(222)
    if (/MSIE[ ]+6/.test(navigator.userAgent))
      frame[SRC] = 'javascript:false';

    console.log(333)
    frame.allowTransparency = 'true'
    frameContainer[APPEND](frame)

    // Try to start writing into the blank iframe. In IE, this will fail if
    // the document.domain has been set, so fall back to using a javascript src
    // for the frame. In IE > 6, these URL's will normally prevent the window
    // from triggering 'onload', so we only use the javascript URL to open the
    // document and set its document.domain
    console.log(444)
    debugger
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
    console.log(555, frame[CWIN][DOC])
    try {
      var frameDocument = frame[CWIN][DOC]
      frameDocument.write(buildIframeHTML())
      frameDocument.close()
    } catch(ex) {
      frame[SRC] = domainSrc + 'd.write("' 
                   + buildIframeHTML().replace(/"/g, String.fromCharCode(92) + '"') 
                   + '");d.close();'
    }
  }

  loadScriptInsideFrame()
}



}.call(this, window, document));
