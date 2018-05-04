/**
 * Master Controller
 */

angular.module('RDash')
    .controller('DashboardCtrl', ['$scope', '$http', '$state', DashboardCtrl]);

function DashboardCtrl($scope, $http, $state) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.isProcessing = false;
    $scope.isFilterApplied = false;
    $scope.sharedVar.showAddButton = true;
    $scope.sharedVar.showFilters = true;
    $scope.listText = 'All Documents';
    $scope.sharedVar.addButton = 'New Document';
    $scope.sharedVar.pageTitle = 'Dashboard';
    $scope.sharedVar.hideSecondHeader = false;
    $scope.sharedVar.hideFilters = false;

    $scope.sharedVar.addNew = function(){
        $state.go('upload');
    };

    getAllFiles();


    function getAllFiles(){
        $scope.isProcessing = true;
        var url = 'http://localhost:8000/documents/document/', queryParams = '';
        if ($scope.filters.searchText){
            queryParams = queryParams + 'file_name=' + $scope.filters.searchText ;
        } else if ($scope.filters.category){
            queryParams = queryParams + 'category=' + $scope.filters.category ;
        } else if ($scope.filters.file_type){
            queryParams = queryParams + 'file_type=' + $scope.filters.file_type ;
        }

        if (queryParams !== ''){
            $scope.listText = 'Filter Result';
            $scope.isFilterApplied = true;
            url = url + '?' + queryParams;
        } else {
            $scope.listText = 'All Documents';
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

    $scope.sharedVar.applySearch = function(){
        console.log($scope.filters.searchText);
        getAllFiles();
    };

    $scope.deleteDocument = function(id){
        console.log(id);
        $http.delete('http://localhost:8000/documents/document/:id'.replace(':id', id)).then(
            function(response){
                console.log(response.data);
                $scope.allDocuments = response.data;
                console.log('11111111111');
            },
            function(response){
                console.log('2222222222', response);
            }
        );
    };


}