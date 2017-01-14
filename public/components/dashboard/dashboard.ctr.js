(function () {
  angular
      .module('hackarthon.dashboard')
      .controller('dashboard.ctrl', dashCtrl);

      function dashCtrl() {

        var dctr = this;

        var connect = function() {


          ws = new WebSocket("ws://"+ window.location.host + "/ws");

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

      		//initial value of dataPoints
      		var dps = [
        		{button: "like", count: 5, color: 'green'},
            {button: "dislike", count: 5, color: 'red'}
      		];

      		var chart = new CanvasJS.Chart("chartContainer",{
      			title: {
      				text: "Lecture Voting"
      			},
      			axisY: {
      				suffix: " votes"
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

      		var updateChart = function (data) {
              switch (data.button) {
                case 'like':
                  dps[0] = {label: data.button , y: data.count, color: 'green'};
                  break;
                case 'dislike':
                  dps[1] = {label: data.button , y: data.count, color: 'red'};
                  break;
                default:

              }
      			chart.render();
      		};

          function initChart() {
            for (var i = 0; i <1; i++) {
            	dps[i] = {label: dps[i].button , y: dps[i].count, color: dps[i].color};
            }
            chart.render();
          }

      		initChart(dps);
          connect();
       }
})();
