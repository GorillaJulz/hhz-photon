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
              updateChart2(data.data);
          };

          ws.onerror = function (e) {
            console.log("onerror:", arguments);
          };
        };

      		//initial value of dataPoints
      		var dps = [
        		{button: "like", count: 2, color: 'green'},
            {button: "dislike", count: 2, color: 'red'}
      		];

          var dps2 = [
        		{button: "wc", count: 1, color: 'green'},
            {button: "coffee", count: 1, color: 'red'},
            {button: "meal", count: 1, color: 'orange'},
            {button: "smoke", count: 1, color: 'yellow'}
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
      				indexLabel: "{y} votes",
      				dataPoints: dps
      			}
      			]
      		});

          var chart2 = new CanvasJS.Chart("chartContainerBreak",{
            title: {
              text: "Breaktime Voting"
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
              indexLabel: "{y} votes",
              dataPoints: dps2
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

          var updateChart2 = function (data) {
              switch (data.button) {
                case 'wc':
                  dps2[0] = {label: data.button , y: data.count, color: 'green'};
                  break;
                case 'coffee':
                  dps2[1] = {label: data.button , y: data.count, color: 'red'};
                  break;
                case 'meal':
                  dps2[2] = {label: data.button , y: data.count, color: 'orange'};
                  break;
                case 'smoke':
                  dps2[3] = {label: data.button , y: data.count, color: 'yellow'};
                  break;
                default:

              }
            chart2.render();
          };

          function initChart() {
            for (var i = 0; i <1; i++) {
            	dps[i] = {label: dps[i].button , y: dps[i].count, color: dps[i].color};
            }
            // dps[0] = {label: dps[0].button , y: dps[o].count, color: dps[0].color};
            // dps[1] = {label: dps[1].button , y: dps[1].count, color: dps[1].color};
            chart.render();
          }

          function initChart2() {
            for (var i = 0; i <1; i++) {
            	dps2[i] = {label: dps2[i].button , y: dps2[i].count, color: dps2[i].color};
            }
            chart2.render();
          }

      		initChart(dps);
          initChart2(dps2);
          connect();
       }
})();
