angular.module("tasklist", ['restangular'])
.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.setBaseUrl("http://localhost:8080/api");
}])
.controller("tasklistCtrl", function($scope, service){
	   
    _constructor = function() {
        service.findAll().then(response => {
            $scope.tasks = response || [];
        });
    }

    _constructor();

    $scope.register = {};

    $scope.changeStatus = function(task) {
        service.changeStatus(task).then(() => {
            _constructor();
        });
    }

    $scope.removeTask = function(task) {
        service.remove(task).then(() => {
            _constructor();
        });
    }

    $scope.editTask = function(task) {
        $scope.register = angular.copy(task);
    }

    $scope.cancel = function() {
        $scope.register = {};
    }

    $scope.save = function() {
        service.save($scope.register).then(() => {
            $scope.cancel();
            _constructor();
        })
    }
})
.service('service', ['Restangular', function(Restangular) {
    this.findAll = function() {
        return Restangular.all("tasks").customGET();
    }

    this.changeStatus = function(task) {
        return task.status === 'DONE' 
            ? Restangular.all('tasks').one('undo', task.id).customPOST() 
            : Restangular.all('tasks').one('do', task.id).customPOST();
    }

    this.remove = function(task) {
        return Restangular.one('tasks', task.id).customDELETE();
    }

    this.save = function(task) {
        return task.id ? Restangular.all('tasks').customPUT(task) : Restangular.all('tasks').customPOST(task);
    }
}]);