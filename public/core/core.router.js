(function(){
    angular
        .module('hackarthon.core')
        .config(function($urlRouterProvider, $stateProvider){

          $urlRouterProvider


          .otherwise('/dashboard');

        });
})();
