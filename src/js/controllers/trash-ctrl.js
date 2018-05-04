/**
 * Master Controller
 */

angular.module('RDash')
    .controller('TrashCtrl', ['$scope', '$http', TrashCtrl]);

function TrashCtrl($scope, $http) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.pageTitle = 'Deleted Documents';
    $scope.sharedVar.pageTitle = 'Trash';
    $scope.sharedVar.hideSecondHeader = false;
    $scope.sharedVar.hideFilters = false;
    $scope.sharedVar.showAddButton = false;

    getTrash();


    function getTrash(){
        $scope.isProcessing = true;
        var url = 'http://localhost:8000/documents/trash', queryParams = '';
        if ($scope.filters.searchText){
            queryParams = queryParams + 'file_name=' + $scope.filters.searchText ;
        } else if ($scope.filters.category){
            queryParams = queryParams + 'category=' + $scope.filters.category ;
        } else if ($scope.filters.file_type){
            queryParams = queryParams + 'file_type=' + $scope.filters.file_type ;
        }

        if (queryParams !== ''){
            url = url + '?' + queryParams;
        }

        $http.get(url).then(
            function(response){
                $scope.allDocuments = response.data;
                $scope.isProcessing = false;
            },
            function(response){
                $scope.isProcessing = false;
            }
        );
    }

    $scope.applySearch = function(){
        getTrash();
    };

    $scope.deleteDocument = function(index, id){
        $http.delete('http://localhost:8000/documents/trash/:id'.replace(':id', id)).then(
            function(){
                $scope.allDocuments.splice(index, 1);
                $scope.isProcessing = false;
                $scope.pushAlert('Document deleted permanently.', 'success');
            },
            function(){
                $scope.isProcessing = false;
            }
        );
    };

    $scope.restoreDocument = function(index, id){
        $http.patch('http://localhost:8000/documents/trash/:id'.replace(':id', id), {active: true}).then(
            function(){
                $scope.allDocuments.splice(index, 1);
                $scope.isProcessing = false;
                $scope.pushAlert('Document restored successfully.', 'success');
            },
            function(){
                $scope.pushAlert('Oopsie!  Some error has occured.', 'danger');
                $scope.isProcessing = false;
            }
        );
    };
}