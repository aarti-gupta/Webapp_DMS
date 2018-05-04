/**
 * Upload Controller
 */

angular
    .module('RDash')
    .controller('UploadCtrl', ['$scope', 'Upload', '$http', UploadCtrl]);

function UploadCtrl($scope, Upload, $http) {
    $scope.pageTitle = 'Upload New File';
    $scope.MAX_ATTACHMENTS = 2;
    $scope.totalFilesAttached = 0;
    $scope.uploadingFiles = [];
    $scope.sharedVar.pageTitle = 'Upload';
    $scope.sharedVar.showAddButton = false;

    var CX_CONSTANTS = {
        QUEUED: 'queued',
        CANCELED: 'canceled',
        DONE: 'done',
        FAILED: 'failed',
        INVALID: 'invalid'
    };
    var processedFilesCount = 0, totalValidUploadingFilesCount = 0;

    $scope.onAllRequestComplete = function() {

        // When all files processed at backend, set the flags value
        if(processedFilesCount == totalValidUploadingFilesCount) {
            $scope.isProcessing = false;
            $scope.isfilesUploaded = true;
            $scope.isFilesUploading = false;
        }
    };

    $scope.removeFileFromQueue = function(file) {
        $scope.validationError = false;
        processedFilesCount += 1;
        $scope.totalFilesAttached -= 1;
        file.status = CX_CONSTANTS.CANCELED;
        $scope.uploadingFiles.splice($scope.uploadingFiles.indexOf(file), 1);
        if(!$scope.uploadingFiles.length){
            $scope.isProcessing = false;
            $scope.isFilesUploading = false;
            $scope.isfilesUploaded = false;
        }
    };

    $scope.uploadFiles = function(files) {
        $scope.fileSaved = false;
        $scope.isfilesUploaded = false;
        $scope.errorFiles = [];// Invalid files that are removed at frontend itself
        $scope.uploadingFiles = $scope.uploadingFiles ? $scope.uploadingFiles : [];// Valid files that are going to be upload

        if (files && files.length) {
            $scope.noFileSelected = false;
            $scope.validationError = false;
            totalValidUploadingFilesCount = totalValidUploadingFilesCount + files.length;
            var canUploadMore = files.length <= $scope.MAX_ATTACHMENTS - $scope.totalFilesAttached;
            $scope.maxNumberOfAttachmentsError = {};
            var url = 'http://localhost:8000/documents/document/';

            if (canUploadMore) {
                files.forEach(function(file) {
                    $scope.isProcessing = true;
                    file.status = CX_CONSTANTS.QUEUED;
                    file.progress = 0;
                    $scope.uploadingFiles.push(file);
                    $scope.totalFilesAttached += 1;

                    file.upload = Upload.upload({
                        method: 'POST',
                        url: url,
                        data: {uploaded_file: file}
                    });

                    file.upload.then(
                        function (response) {
                            // On Success
                            if (file.status !== CX_CONSTANTS.CANCELED) {
                                processedFilesCount += 1;
                                file.status = CX_CONSTANTS.DONE;
                                file.url = response.data.uploaded_file;
                                file.temp_storage_id = response.data.id;
                                $scope.onAllRequestComplete();
                            }

                        }, function (response) {
                            // On Failure
                            if (file.status !== CX_CONSTANTS.CANCELED) {
                                processedFilesCount += 1;
                                if (response.status === 400) {
                                    if (response.data.non_field_errors) {
                                        file.status = CX_CONSTANTS.FAILED;
                                    } else {
                                        file.status = CX_CONSTANTS.INVALID;
                                        file.errorText = response.data.uploaded_file[0];
                                    }
                                    $scope.errorFiles.push(file);
                                    $scope.uploadingFiles.splice($scope.uploadingFiles.indexOf(file), 1);
                                    $scope.totalFilesAttached -= 1;
                                } else {
                                   $scope.pushAlert('Oopsie! Some error has occurred.');
                                }
                                $scope.onAllRequestComplete();
                            }
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });
                });
            } else {
                totalValidUploadingFilesCount = totalValidUploadingFilesCount - files.length;
                $scope.uploadingFiles = $scope.uploadingFiles ? $scope.uploadingFiles : [];
                $scope.maxNumberOfAttachmentsError.status = true;
                $scope.maxNumberOfAttachmentsError.remaining = $scope.MAX_ATTACHMENTS - $scope.totalFilesAttached;
                $scope.validationError = true;
                $scope.pushAlert('You can only upload 10 files at once.', 'danger');
            }
        }
    };

    $scope.saveCallback = function() {

        // Return if files are still uploading
        if($scope.isProcessing){
            $scope.isFilesUploading = true;
            $scope.infoMsg = 'File Uploading is in Progress.';
            return;
        }
        //Return if no file selected to upload
        if ($scope.uploadingFiles === undefined || $scope.uploadingFiles.length === 0) {
            $scope.noFileSelected = true;
            $scope.infoMsg = "No File Selected.";
            return;
        }

        // Else collect ids of file to be uploaded
        var file_ids_to_save = [], payLoad = {};
        angular.forEach($scope.uploadingFiles, function(file){
            if(file.status === CX_CONSTANTS.DONE){
                file_ids_to_save.push(file.temp_storage_id);
            }
        });
        payLoad.ids = file_ids_to_save;

        // Send request
        $http.patch('http://localhost:8000/documents/bulk-save/', payLoad).then(
            function(response){
                $scope.fileSaved = true;
                $scope.pushAlert('Files Uploaded Successfully.');
            },
            function(response){
                $scope.pushAlert('Oopsiee! Some error has occurred. Please try again later.');
            }
        );
    };

    $scope.cancelCallback = function() {
        $scope.uploadedFiles = [];
    };
}