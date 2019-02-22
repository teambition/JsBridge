(function() {

  if (window.TeambitionMobileSDK) {
    return;
  }

    function _createQueueReadyIframe(doc) {
          messagingIframe = doc.createElement('iframe');
          messagingIframe.style.display = 'none';
          doc.documentElement.appendChild(messagingIframe);
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

      var doc = document;
      _createQueueReadyIframe(doc);
      var readyEvent = doc.createEvent('Events');
      readyEvent.initEvent('TeambitionMobileSDKReady');
      readyEvent.bridge = TeambitionMobileSDK;
      doc.dispatchEvent(readyEvent);

    });

})();