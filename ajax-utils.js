(function (global) {
  var DC = global.$dc = global.$dc || {};

  DC.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = new XMLHttpRequest();
    isJsonResponse = (isJsonResponse === undefined) ? true : isJsonResponse;
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var response = isJsonResponse ? JSON.parse(request.responseText) : request.responseText;
        responseHandler(response);
      }
    };
    request.open("GET", requestUrl, true);
    request.send(null);
  };
})(window);
