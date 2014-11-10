var ApiFactory = function(withRequest, cookieJar)
{
  return function (url, secureUrl, modifyRequest)
  {
    var self = this;
    var postfix          = '/v' + this.version + '/';
    var contextUrl       = url + postfix;
    var secureContextUrl = (secureUrl || url.replace(/^http:/, "https:")) + postfix;

    this.cookieJar = cookieJar;

    if(!modifyRequest) modifyRequest = function(req) { return req; };

    var finalModifyRequest = function(req)
    {
      withRequest(req, self);
      return modifyRequest(req);
    }

    $apinamespace$.setContext(this, contextUrl, secureContextUrl, finalModifyRequest);
  };
};
