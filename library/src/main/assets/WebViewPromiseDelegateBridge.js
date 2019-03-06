(function() {

  if (window.TeambitionMobileSDK) {
    return;
  }

  function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function() {
          callback(WebViewJavascriptBridge);
        }, false);
    }
  }

  connectWebViewJavascriptBridge(function(bridge) {
    var TeambitionMobileSDK = window.TeambitionMobileSDK = {
      call: function(funcName, jsonRequest) {
        return new Promise(function(resolve, reject) {
          const requestStr = JSON.stringify(jsonRequest);
          bridge.callHandler(funcName, requestStr,
            function(bridgeResponse) {
              const response = JSON.parse(bridgeResponse);
              if (response.isSuccess) {
                resolve(response.data);
              } else {
                let err = {
                  name: response.error.name,
                  message: response.error.message
                };
                reject(err);
              }
            }
          );
        });
      }
    };

    var readyEvent = document.createEvent('Events');
    readyEvent.initEvent('TeambitionMobileSDKReady');
    readyEvent.TeambitionMobileSDK = TeambitionMobileSDK;
    document.dispatchEvent(readyEvent);

  });

})();