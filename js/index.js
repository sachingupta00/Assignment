var app = 	angular.module('myApp', ['infinite-scroll'])
			.controller('appController', appController);

appController.$inject = ['$scope', '$window', '$http', '$timeout'];

function appController($scope, $window, $http, $timeout) {
	$scope.form = {};
	$scope.edit = 0.1;
	$scope.title = "infinite scroll example";
	//$scope.searchTerm = "";
	$scope.contentLimit = 20;
	$http.get("https://api.github.com/repositories?since=862").then(function(response) {
		$scope.content = response.data;
		console.log($scope.content);
		$scope.loadMore = function() {
			if ($scope.contentLimit + 5 < $scope.content.length) {
				$scope.contentLimit += 5;
			} else {
				$scope.contentLimit = $scope.content.length;
			}
		};
	});

   
	$scope.action = function(evt,cls,item){
		console.log(cls);
		console.log(evt);
		console.log(item);
		$scope.edit = cls;
		switch(evt){
			case 'floppy-save' :
				$scope.font = 'pencil';
				if($scope.edit!=$scope.prev)										// If some row's edit option is active and other pencil icon is clicked.
					$scope.action($scope.font,cls,item);
				else{
					console.log($scope.form[cls]);
					$scope.content[cls].name = $scope.form[cls].name;
					$scope.content[cls].description = $scope.form[cls].description;
					$scope.content[cls].owner.login = $scope.form[cls].owner;
					$scope.content[cls].owner.type = $scope.form[cls].owner_type;
					$.ajax({
						type:'POST',
						url:$scope.externalLink,				// Change External API link here...
						data:JSON.stringify($scope.form[cls]),
						dataType:'json',
						crossDomain: true,
						success:function(response){
							console.log("Data submitted successfully..");
						}
					});
					$scope.edit = 0.1;
				}
			break;
			case 'pencil':
				$scope.prev = cls;
				$scope.form[cls] = {};
				$scope.form[cls].name = item.name;
				$scope.form[cls].description = item.description;
				$scope.form[cls].owner = item.owner.login;
				$scope.form[cls].owner_type = item.owner.type;
				$scope.font = 'floppy-save';
			break;
			case 'cancel':
				$scope.font = 'pencil';
			break;
		}
	}
   
	$timeout( function(){
		var $table = $('#contentTable');
		$table.floatThead();
	});
};