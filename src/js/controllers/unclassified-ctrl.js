/**
 * Master Controller
 */

angular.module('RDash')
    .controller('UnClassifiedCtrl', ['$scope', '$http', UnClassifiedCtrl]);

function UnClassifiedCtrl($scope, $http) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.pageTitle = 'Un-Classified Documents';
    $scope.sharedVar.pageTitle = 'UnClassified';
    $scope.sharedVar.hideFilters = true;
    $scope.sharedVar.hideSecondHeader = true;

    getUnClassifiedDocuments();

    function getUnClassifiedDocuments(){
        $scope.isProcessing = true;
        $http.get('http://localhost:8000/documents/un-classified').then(
            function(response){
                $scope.allDocuments = response.data;
                $scope.isProcessing = false;
            },
            function(response){
                $scope.isProcessing = false;
            }
        );
    };
}