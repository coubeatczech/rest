var $apinamespace$ = ApiFactory(function(a) {return a}, undefined);

// find out which type of module management are we in, export api and import jquery via it
var jq = (function() {
  if (typeof module === "object" && module && typeof module.exports === "object") {
    // Using browserify, webpack or similar
    module.exports = $apinamespace$;
    return require("jquery");
  } else if (typeof define === "function" && define.amd) {
    // Export as AMD.
    define("$apinamespace$", [], function () { return $apinamespace$; });
    return $dollar$; // todo AMD does dependencies differently, probably
  } else {
    // Export as global.
    window.$apinamespace$ = $apinamespace$;
    return $dollar$;
  }
})();

$apinamespace$.ajaxCall = function jQueryRequest (method, url, params, success, error, contentType, acceptHeader, data, callOpts, modifyRequest)
{
  var q = window.Q || function (a) { return a };

  var headers = jq.extend(true, {}, $apinamespace$.defaultHeaders);
  $apinamespace$.addObject(headers, { Accept : acceptHeader });

  var callData =
    { type        : method
    , url         : url + (params ? '?' + jq.param(params) : '')
    , cache       : false
    , success     : success || function () {}
    , error       : error || function () {}
    , contentType : contentType
    , headers     : headers
    , xhrFields   : { withCredentials: true }
    , data        : data || []
    };

  callData = modifyRequest(callData);

  $apinamespace$.addObject(callData, $apinamespace$.defaultAjaxOptions);
  $apinamespace$.addObject(callData, callOpts);

  return q(jq.ajax(callData));
}
