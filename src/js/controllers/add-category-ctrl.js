/**
 * Master Controller
 */

angular.module('RDash')
    .controller('AddCategoryCtrl', ['$scope', '$http', '$stateParams', AddCategoryCtrl]);

function AddCategoryCtrl($scope, $http, $stateParams) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.sharedVar.pageTitle = $stateParams.id? 'Edit Category' : 'Add New Category';
    $scope.sharedVar.showAddButton = false;
    $scope.sharedVar.hideFilters = true;
    $scope.sharedVar.hideSecondHeader = false;
    $scope.sharedVar.hideSecondHeader = true;
    $scope.category = $stateParams.id && $stateParams.category? angular.copy($stateParams.category) : {};

    if($stateParams.id && !$stateParams.category){
        $http.get('http://localhost:8000/categories/category/' + $stateParams.id, $scope.category).then(
            function(response){
                $scope.isProcessing = false;
                $scope.category = response.data;
            },
            function(){
                $scope.isProcessing = false;
            }
        );
    }

    $scope.save = function(){
        $http.post('http://localhost:8000/categories/category/', $scope.category).then(
            function(){
                $scope.isProcessing = false;
                $scope.pushAlert('Category created successfully.', 'success');
            },
            function(response){
                $scope.isProcessing = false;
                if(response.data.name){
                    $scope.pushAlert(response.data.name[0]);
                }
            }
        );
    };

    $scope.update = function(category){
        $http.put('http://localhost:8000/categories/category/:id'.replace(':id', category.id), category).then(
            function(){
                $scope.isProcessing = false;
                $scope.pushAlert('Category updated successfully.', 'success');
            },
            function(){
                $scope.isProcessing = false;
            }
        );
    };
}