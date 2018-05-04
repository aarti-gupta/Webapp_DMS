/**
 * Master Controller
 */

angular.module('RDash')
    .controller('UnClassifiedCtrl', ['$scope', '$http', UnClassifiedCtrl]);

function UnClassifiedCtrl($scope, $http) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.sharedVar.pageTitle = 'UnClassified Documents';
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

    $scope.deleteDocument = function(index, id){
        $http.delete('http://localhost:8000/documents/document/:id'.replace(':id', id)).then(
            function(response){
                $scope.allDocuments.splice(index, 1);
                $scope.pushAlert('Document moved to trash.');
            },
            function(response){
            }
        );
    };
}