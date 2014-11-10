$apinamespace$.addObject = function (obj1, obj2)
{
  for (var fld in obj2)
    obj1[fld] = obj2[fld];
};

$apinamespace$.defaultAjaxOptions = {};
$apinamespace$.defaultHeaders = {};

$apinamespace$.setContext =
  function (obj, url, secureUrl, modifyRequest)
  {
    obj.contextUrl = url;
    obj.secureContextUrl = secureUrl;
    obj.modifyRequest = modifyRequest;
    for (var fld in obj)
    {
      if (obj[fld] != undefined && obj[fld].apiObjectType != undefined && obj[fld].apiObjectType == 'resourceDir')
      {
        var postfix = fld.replace(/([a-z0-9])([A-Z])/g, '$dollar$1-$dollar$2').toLowerCase() + '/';
        $apinamespace$.setContext(obj[fld], url + postfix, secureUrl + postfix, modifyRequest);
      }
    }
  };
