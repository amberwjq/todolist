var todoList = angular.module('todoList', []);


// todoList.config(['$routeProvider', function($routeProvider){
//     $routeProvider
//         .when('/nihao', {
//             templateUrl: './home.html',
//             //controller: 'todoListController'
//         }) 
//         .when('/', {
//             templateUrl: './home.html',
//             //controller: 'todoListController'
//         })               
//         .otherwise({
//             redirectTo: '/'
//         });
// }]);


todoList.controller('todoListController',function todoListController($scope,$http)
{
    formdata={
                content: ''
            };
    editableContent={
                content: ''
            };       
    // $scope.todos=[{"_id":"590c075f11ce04c78fd3266a","content":"buy milk","category":"family"}]
    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $http.get('/api/completed')
        .success(function(data) {
            console.log('get doneItems')
            $scope.doneItems = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });    

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todo', $scope.formdata)
  //        $http(
  //        {
  //         method: 'POST',
  // url: 'http://localhost:8000/api/todo',
  // // headers: 
  // //  { 'postman-token': '4143bcc0-3ccd-1228-9ce8-8739ba97c9de',
  // //    'cache-control': 'no-cache',
  // //    'content-type': 'application/json' },
  // data: $scope.formdata,
  // json: true  
  //        })
            .success(function(data) {
                $scope.formdata={};
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    $scope.doneTask = function(id){
      $http.put('/api/todo/done/' + id)
      .success(function(data){
              $scope.todos = data;
              console.log(data)
            })
      .error(function(data){
        console.log('Error:' + data);
            });
      
    };
    $scope.enableEdit = function(id){
      $http.put('/api/todo/get/' + id)
      .success(function(data){
              $scope.todos = data;
              console.log(data)
            })
      .error(function(data){
        console.log('Error:' + data);
            });
      
    };    

    $scope.doneEditing = function(id){
      console.log("I AM AT doneEditing");
      console.log('INPUT IS ' + editableContent);
       // $http.put('/api/todo/edit/' + id,$scope.editableContent)
        $http.put('/api/todo/edit/' + id, $scope.editableContent)

//               $http(
//          {
//           method: 'PUT',
//   url: 'http://localhost:8000/api/todo/edit/'+id,
//   headers: 
//    {     "content-type": "application/json",
//     "cache-control": "no-cache",
//     "postman-token": "25ab15bb-acac-cd78-d136-f06f932abfe7" },
//   data: $scope.editableContent,
// //   data:{
// //   "content":"newkang"
// // },
//   json: true  
//          }) 
      .success(function(data){
              $scope.todos = data;
              console.log(data)
            })
      .error(function(data){
        console.log('Error:' + data);
            });     

   };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todo/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


})
