(function () {
  angular
      .module('hackarthon.dashboard')
      .controller('dashboard.ctrl', dashCtrl);

      function dashCtrl() {

        var dctr = this;
        dctr.like = 1;
        dctr.dlike = 2;
        dctr.kitchenl = 2;
        dctr.kitchend = 4;

        console.log("do somthing "+dctr.like);
        console.log("hallo");

        var connect = function() {

          ws = new WebSocket("ws://hhz-photon.eu-gb.mybluemix.net/ws");
          //ws = new WebSocket("ws://"+ window.location.host + "/ws");

          ws.onopen = function (e) {
            console.log("onopen:", arguments);
          };

          ws.onclose = function (e) {
            console.log("onclose:", arguments);
          };

          ws.onmessage = function (e) {
            console.log("onmessage:", arguments);
            var data = JSON.parse(e.data);
            	updateChart(data.data);
          };

          ws.onerror = function (e) {
            console.log("onerror:", arguments);
          };
        };
        connect();


      		//initial value of dataPoints
      		// var arguments = [
      		// {button: "like", count: 5, time: 'green'},
          //
      		// ];

      		var chart = new CanvasJS.Chart("chartContainer",{
      			title: {
      				text: "physical likes"
      			},
      			axisY: {
      				suffix: " C"
      			},
      			legend :{
      				verticalAlign: 'bottom',
      				horizontalAlign: "center"
      			},
      			data: [
      			{
      				type: "column",
      				bevelEnabled: true,
      				indexLabel: "{y} C",
      				dataPoints: dps
      			}
      			]
      		});


      //		var updateInterval = 1000;


      		var updateChart = function (data) {
              switch (data.button) {
                case 'like':
                  dps[0] = {label: data.button , y: data.count, color: 'green'};
                  dctr.like = data.count;

                  break;
                case 'dislike':
                  dps[1] = {label: dps[1].label , y: dps[1].y, color: 'red'};
                  dctr.dlike = data.count;
                  break;
                default:

              }



      			// for (var i = 0; i <1; i++) {
            //
      				// // generating random variation deltaY
      				// var deltaY = Math.round(2 + Math.random() *(-2-2));
      				// var yVal = deltaY + dps[i].y > 0 ? dps[i].y + deltaY : 0;
      				// var boilerColor;
              //
              //
      				// // color of dataPoint dependent upon y value.
              //
      				//  boilerColor =
      				// yVal > 200 ? "#FF2500":
      				//   dps[i].label == 'like' ? "#FF6000":
      				//   dps[i].label == 'dislike' ? "#6B8E23 ":
      				//  null;
              //

      				// updating the dataPoint
      			// 	dps[i] = {label: dps[i].label , y: dps[i].y, color: dps[i].boilerColor};
            //
      			// };

      			chart.render();
      		};

      		//updateChart(arguments);
       }
})();
