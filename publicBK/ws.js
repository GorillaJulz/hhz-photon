(function() {
  messageHandler = {
    goodbye: function () {
      console.log("connection closed for some reason");
    },
    hello: function () {
      console.log("connection active");
    }
  };

   var connect = function() {
     ws = new WebSocket("ws://hhz-photon.eu-gb.mybluemix.net/ws");

     ws.onopen = function (e) {
       messageHandler.hello();
     };

     ws.onclose = function (e) {
       messageHandler.goodbye();
     };

     ws.onmessage = function (e) {
       data = JSON.parse(e.data);
       console.log(data.data.button);
       switch (data.data.button) {
         case "like":
           document.getElementById('like-count').innerHTML = data.data.count;
           break;
         case "dislike":
           document.getElementById('dislike-count').innerHTML = data.data.count;
           break;
       }

     };

     ws.onerror = function (e) {
       console.log("onerror:", arguments);
     };
   };
   connect();
})();
