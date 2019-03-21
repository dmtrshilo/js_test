chrome.runtime.onInstalled.addListener(function() {
    console.log('onInstalled');

   // Replace all rules ...
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
       console.log('onPageChanged');

     // With a new rule ...
     chrome.declarativeContent.onPageChanged.addRules([
       {
         // That fires when a page's URL contains a 'g' ...
         conditions: [
           new chrome.declarativeContent.PageStateMatcher({
             pageUrl: { hostEquals: 'www.cian.ru'},
           })
         ],
         // And shows the extension's page action.
         actions: [ new chrome.declarativeContent.ShowPageAction() ]
       }
     ]);
   });
 });
