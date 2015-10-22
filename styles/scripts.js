var app = angular.module("app", ["firebase"]);

      app.directive('autoTabTo', [function () {
        return {
            restrict: "A",
            link: function (scope, el, attrs) {
                el.bind('keyup', function(e) {
                  if (this.value.length === this.maxLength) {
                    var element = document.getElementById(attrs.autoTabTo);
                    if (element)
                      element.focus();
                  }
                });
            }
        }
      }]);



      app.controller("ctrl", ["$scope", "$firebaseArray",
        function($scope, $firebaseArray) {
          
          var unplayedRef = new Firebase("https://mariomaker.firebaseio.com/trent/unplayed");
          $scope.unplayedLevels = $firebaseArray(unplayedRef);
          
          var playedRef = new Firebase ("https://mariomaker.firebaseio.com/trent/played");
          $scope.playedLevels = $firebaseArray(playedRef);
          

          // Login stuff
//          var ref = new Firebase("https://mariomaker.firebaseio.com");
 //         ref.authWithPassword({
//            email    : $scope.email,
//            password : $scope.password
//          }, function(error, authData) {
//            if (error) {
//              console.log("Login Failed!", error);
//            } else {
//              console.log("Authenticated successfully with payload:", authData);
//            }
 //         });

          
          //ADD NEW LEVEL METHOD
          $scope.addLevel = function(e) {
          $scope.newLevel = $scope.levelPiece1.toUpperCase() + " - " +  $scope.levelPiece2.toUpperCase()  + " - " + $scope.levelPiece3.toUpperCase()  + " - " + $scope.levelPiece4.toUpperCase();
            //WHEN SUBMIT IS PRESSED
            if ($scope.name && $scope.levelPiece2 == 0000 && $scope.levelPiece1.length == 4 && $scope.levelPiece2.length == 4 && $scope.levelPiece3.length == 4 && $scope.levelPiece4.length == 4) {
              $scope.unplayedLevels.$add({ name: $scope.name, level: $scope.newLevel });
              //RESET LEVEL BOXES
              $scope.levelPiece1 = "";
              $scope.levelPiece2 = "";
              $scope.levelPiece3 = "";
              $scope.levelPiece4 = "";
            }
            
            else {
               alert("Something is wrong. Please double check that you have entered a name and a valid level code.");
            }
            
          };
          
          
          // GET A RANDOM LEVEL
          
          $scope.getRandom = function() {
            $scope.unplayedLevels.$loaded().then(function(unplayedLevels) {
               var randomNum = Math.floor((Math.random() * unplayedLevels.length));
               console.log(randomNum);
               var randomLevel = unplayedLevels[randomNum];
               $scope.displayRandomLevel = randomLevel;
               console.log(randomLevel);
               
               $scope.playedLevels.$add(randomLevel);
               $scope.unplayedLevels.$remove(randomLevel);
               
            });
            
          };
          
          
          // MAKE SURE YOU CANT ADD A LEVEL THAT ALREADY EXISTS
          
          // REMOVE A LEVEL FROM THE POOL AFTER IT HAS BEEN PLAYED. POSSIBLY SAVE TO NEW "PREVIOUSLY PLAYED" OBJECT SO WE CAN CHECK AGAINST THAT.
          

          
          
        }
      ]);
      
