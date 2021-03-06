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
          
          $scope.test = "test";

          var unplayedRef = new Firebase("https://mariomaker.firebaseio.com/trent/unplayed");
          $scope.unplayedLevels = $firebaseArray(unplayedRef);
          
          var playedRef = new Firebase ("https://mariomaker.firebaseio.com/trent/played");
          $scope.playedLevels = $firebaseArray(playedRef);
          

          // AUTH STUFF
          
          
          $scope.email = "";
          $scope.password = "";
          



          $scope.logging = function() {
            console.log("You pressed submit");
            var ref = new Firebase("https://mariomaker.firebaseio.com");
            ref.authWithPassword({
              email    : $scope.email.toString(),
              password : $scope.password.toString()
            }, function(error, authData) {
              if (error) {
                console.log("Login Failed!", error);
              } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.refresh();
              }
            });
          }




          var authRef = new Firebase("https://mariomaker.firebaseio.com/.info/authenticated");
          authRef.on("value", function(snap) {
            if (snap.val() === true) {
              
              $scope.loggedin = true;
              $scope.loggedout = false;
              //location.href = 'admin.html';
              console.log("authenticated");

            } else {
              console.log("not authenticated");
              $scope.loggedin = false;
              $scope.loggedout = true;

            }
          });

          $scope.adminCheckRandom = function() {

            if ($scope.loggedin === true) {
              $scope.getRandom();
            }

            else {
              window.location.href = 'index.html';
            }

          };

          $scope.adminCheckDelete = function() {
            if ($scope.loggedin === true) {
              $scope.dangerDelete();
            }

            else {
              window.location.href = 'index.html';
            }
          };


          $scope.refresh = function() {
            window.location.href = 'index.html';
          }


          $scope.logout = function() {
            var ref = new Firebase("https://mariomaker.firebaseio.com");
            ref.unauth();
            window.location.href = 'index.html';
          };

            // END AUTH STUFF

          //ADD NEW LEVEL METHOD
          $scope.addLevel = function(e) {

          
            //WHEN SUBMIT IS PRESSED
            if ($scope.name && $scope.levelPiece2 == 0000 && $scope.levelPiece1.length == 4 && $scope.levelPiece2.length == 4 && $scope.levelPiece3.length == 4 && $scope.levelPiece4.length == 4) {
              
            $scope.newLevel = $scope.levelPiece1.toUpperCase() + " - " +  $scope.levelPiece2.toUpperCase()  + " - " + $scope.levelPiece3.toUpperCase()  + " - " + $scope.levelPiece4.toUpperCase();
            $scope.newLevel = $scope.newLevel.toString();
            $scope.checkPass = true;

              console.log("scope.newLevel is " + $scope.newLevel);
              makeArrays();
            }
            
            else {
               alert("Something is wrong. Please double check that you have entered a name and a real level code.");
            }
            
          };


            //Populate arrays to check against later

            function makeArrays() {

              var playedList = new Firebase("https://mariomaker.firebaseio.com/trent/played");
              var played = $firebaseArray(playedList);
              $scope.awefulPlayedLevelArray = [];
              played.$loaded()
                .then(function(){
                    angular.forEach(played, function(data) {
                        $scope.awefulPlayedLevelArray.push(data.level);
                        
                    })
                    //console.log($scope.awefulPlayedLevelArray);
                    //checkIfLevelExistsInPlayed($scope.newLevel);
                });

              var unplayedList = new Firebase("https://mariomaker.firebaseio.com/trent/unplayed");
              var unplayed = $firebaseArray(unplayedList);
              $scope.awefulUnplayedLevelArray = [];
              unplayed.$loaded()
                .then(function(){
                    angular.forEach(unplayed, function(data) {
                        $scope.awefulUnplayedLevelArray.push(data.level);
                        
                    })
                    //console.log($scope.awefulUnplayedLevelArray);
                    checkIfLevelExistsInUnplayed($scope.newLevel);
                });


            }


            // Tests to see if level exists already in unplayed
            

            function checkIfLevelExistsInUnplayed(newLevel) {
              console.log("checking unplayed")
              
              console.log("checkPass is " + $scope.checkPass)
              for (var i = 0; i < $scope.awefulUnplayedLevelArray.length; i++) {
                  if (newLevel === $scope.awefulUnplayedLevelArray[i]){
                    console.log("match")
                    $scope.checkPass = false;
                    console.log("checkPass is " + $scope.checkPass)
                    levelExistsCallback(newLevel);
                    break;
                  }
              }
                
                if ($scope.checkPass === true){
                  console.log("checkPass is " + $scope.checkPass)
                  checkIfLevelExistsInPlayed(newLevel);
                }
                
            }

            // Tests to see if level exists already in played
            function checkIfLevelExistsInPlayed(newLevel) {

                console.log("checking played")
                
                console.log("checkPass is " + $scope.checkPass)
              
                for (var i = 0; i < $scope.awefulPlayedLevelArray.length; i++) {
                    if (newLevel === $scope.awefulPlayedLevelArray[i]){
                      console.log("match")
                      $scope.checkPass = false;
                      console.log("checkPass is " + $scope.checkPass)
                      levelExistsCallback(newLevel);
                      break;
                    }
                }
                  
                  if ($scope.checkPass === true){
                  console.log("checkPass is " + $scope.checkPass)
                  levelExistsCallback(newLevel);
              }
            }



           // What to do after we check if level exists
           function levelExistsCallback(newLevel) {
            console.log("Deciding what message to give")
              if ($scope.checkPass === false) {
                alert('Level "' + newLevel + '"" was not added. No duplicates!');
              } else {
                $scope.unplayedLevels.$add({ name: $scope.name, level: $scope.newLevel });
                alert('Level "' + newLevel + '"" has been submitted!');
                //RESET LEVEL BOXES
                $scope.levelPiece1 = "";
                $scope.levelPiece2 = "";
                $scope.levelPiece3 = "";
                $scope.levelPiece4 = "";
              }
            }   
            
            

          
          
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


          // Scary delete button
          $scope.dangerDelete = function() {
            $scope.unplayedLevels.$loaded().then(function(unplayedLevels) {
               
               for (var i = 0; i < $scope.unplayedLevels.length; i++) {
                  $scope.unplayedLevels.$remove(unplayedLevels[i]);
               }
               
               
            });
            
          };



          
          // cute wombat test
          $scope.wombat = function() {
            console.log("wombat");
          };

          
          
        }
      ]);
      
