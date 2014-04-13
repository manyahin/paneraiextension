var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40342023-1']);
_gaq.push(['_trackPageview']);
setInterval(function(){
    _gaq.push(['_trackPageview','/active']);
},295000);

// Setup localStorage
// Allow sites
var storedUrls = localStorage['urls'];
if(typeof storedUrls === 'undefined') {
	//load default settings
	storedUrls = ['watch.ru', 'network54.com'];
	localStorage['urls'] = JSON.stringify(storedUrls);
}
var urls = JSON.parse(localStorage['urls']);

// Facebook
var facebookValue = localStorage['facebook'];
if(typeof facebookValue === 'undefined') {
	// default load facebook widgets
	facebookValue = true; 
	localStorage['facebook'] = facebookValue;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(request.url) {

      var urls = JSON.parse(localStorage['urls']);
      
      var url = request.url;
      var tabId = sender.tab.id;
      var allow = false;

      for (var i = urls.length - 1; i >= 0; i--) {
        if(url.indexOf(urls[i]) > -1) {
          allow = true;
          break;
        }
      };

      if(allow) {
        chrome.pageAction.show(tabId);
        sendResponse({rulez: true});
      }
    }

    if(request.need) {
      var facebookValue = localStorage['facebook'];
      sendResponse({answer: facebookValue});
    }    

    if(request.storeGet) {
      var what = request.storeGet;
      var store = localStorage[what];
      sendResponse({answer: store});
    }

    if(request.storeSet) {
      var what = request.storeSet;
      var value = request.val;
      localStorage[what] = value;
      sendResponse({answer: 'ok'});
    }
  });

/* Google Analytics */

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();