var $apinamespace$ = ApiFactory(function(req, self) { req.jar = self.cookieJar }, require('request').jar());

// Export as Node module.
module.exports = $apinamespace$;

$apinamespace$.ajaxCall = function (method, url, params, onSuccess, onError, contentType, acceptHeader, data, callOpts, modifyRequest)
{
  var allParams = {};
  $apinamespace$.addObject(allParams, params);

  if (method === "GET" || method === "HEAD")
    // Avoid cached API responses.
    allParams._ = Date.now();

  var headers = { "Content-type" : contentType
                , "Accept"       : acceptHeader
                };

  $apinamespace$.addObject(headers, $apinamespace$.defaultHeaders);

  var callData =
    { url     : url
    , qs      : allParams
    , method  : method
    , headers : headers
    };

  if (data) callData.body = data;

  callData = modifyRequest(callData);

  $apinamespace$.addObject(callData, $apinamespace$.defaultAjaxOptions);
  $apinamespace$.addObject(callData, callOpts);

  return require("q").Promise(function (resolve, reject)
  {
    require("request")(callData, callback);

    function callback (error, message, body)
    {
      if (message && message.statusCode >= 200 && message.statusCode < 300)
      {
        var parsedResponse = parse(body);
        onSuccess && onSuccess(parsedResponse, message);
        resolve(parsedResponse)
      }
      else
      {
        if (!error)
        {
          error = new Error("HTTP request error");
          error.statusCode = message.statusCode;
          error.responseBody = body;
        }

        error.response = parse(body);

        if (onError)
          onError(error);

        reject(error);
      }
    }
  });

  function parse (response)
  {
    if (acceptHeader.split(";").indexOf('text/json') >= 0)
    {
      var r = response;
      try
      {
        r = JSON.parse(response);
      }
      catch (e)
      {
        return r;
      }
      return r;
    }
    else return response;
  }
}
