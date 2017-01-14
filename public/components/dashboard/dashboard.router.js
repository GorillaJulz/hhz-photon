(function () {
  angular
      .module('hackarthon.dashboard')
      .config(function ($stateProvider) {

        $stateProvider

          .state('dashboard', {
            url: '/dashboard',
            templateUrl: "components/dashboard/dashboard.html",
            controller: 'dashboard.ctrl',
            controllerAs: 'dashCtrl'
          })
      });
})();
