/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;
    $scope.filters = {};
    $scope.isProcessing = false;
    $scope.isFilterApplied = false;
    $scope.addButton = 'New Document';
    $scope.sharedVar = {};
    $scope.sharedVar.alerts = [];

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.closeAlert = function(index) {
        $scope.sharedVar.alerts.splice(index, 1);
    };

    $scope.pushAlert = function(msg, type){
        type = type ? type : 'info';
        $scope.sharedVar.alerts.push({
            msg: msg,
            type: type
        });
    }


}