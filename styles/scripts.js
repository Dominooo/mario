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
          
          var currentRef = new Firebase ("https://mariomaker.firebaseio.com/trent/current");
          $scope.currentLevel = $firebaseArray(currentRef);
          

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

          $scope.adminCheckPutBack = function() {
            if ($scope.loggedin === true) {
              $scope.putBack();
            }

            else {
              window.location.href = 'index.html';
            }
          }

          $scope.adminCheckWinner = function() {
            if ($scope.loggedin === true) {
              $scope.winner();
            }

            else {
              window.location.href = 'index.html';
            }
          }

          $scope.adminCheckLoser = function() {
            if ($scope.loggedin === true) {
              $scope.loser();
            }

            else {
              window.location.href = 'index.html';
            }
          }

          $scope.adminCheckSelectUnplayed = function(fireid) {
            if ($scope.loggedin === true) {
              $scope.selectUnplayed(fireid);
            }

            else {
              window.location.href = 'index.html';
            }
          }

          $scope.adminCheckSelectPlayed = function(fireid) {
            if ($scope.loggedin === true) {
              $scope.selectPlayed(fireid);
            }

            else {
              window.location.href = 'index.html';
            }
          }
          

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

                alert('Level "' + newLevel + '"" was NOT added. No duplicates!');

              } else {
                $scope.unplayedLevels.$add({ name: $scope.name, level: $scope.newLevel, beat: 'not yet' });
                alert('Level "' + newLevel + '"" has been submitted!');
                //RESET LEVEL BOXES
                $scope.levelPiece1 = "";
                $scope.levelPiece2 = "";
                $scope.levelPiece3 = "";
                $scope.levelPiece4 = "";
              }
            }   
            

            

          // GET A RANDOM LEVEL
          $scope.randomLock = false;
          
          $scope.getRandom = function() {

            if ($scope.randomLock === false){

              $scope.unplayedLevels.$loaded().then(function(unplayedLevels) {
                 var randomNum = Math.floor((Math.random() * unplayedLevels.length));
                 console.log(randomNum);
                 var randomLevel = unplayedLevels[randomNum];
                 $scope.displayCurrentLevel = randomLevel;
                 console.log(randomLevel);
                 
                 $scope.randomLock = true;

                 $scope.currentLevel.$add(randomLevel);
                 $scope.unplayedLevels.$remove(randomLevel);

                 //$scope.playedLevels.$add(randomLevel);
                 
                 
              });
            
            } else  {

              alert('there was a problem generating a level')
              
            } 

          };

          // select an unplayed level
          $scope.selectUnplayed = function(fireid){
            console.log('random lock is ' + $scope.randomLock)
            if ($scope.randomLock === false){
              console.log('outside the id is' + fireid)
              $scope.unplayedLevels.$loaded().then(function(unplayedLevels) {
                console.log('inside the id is' + fireid)
                 var thisRecord = unplayedLevels.$getRecord(fireid);
                  console.log('this record is' + thisRecord)
                    $scope.currentLevel.$add(thisRecord);
                    $scope.unplayedLevels.$remove(thisRecord);
                    $scope.randomLock = true;
            });

            } else  {

              alert('there was a problem selecting an unplayed level')
              
            } 
          }

          // select a played level
          $scope.selectPlayed = function(fireid){
            console.log('random lock is ' + $scope.randomLock)
            if ($scope.randomLock === false){
              console.log('outside the id is' + fireid)
              $scope.playedLevels.$loaded().then(function(playedLevels) {
                console.log('inside the id is' + fireid)
                 var thisRecord = playedLevels.$getRecord(fireid);
                  console.log('this record is' + thisRecord)
                    $scope.currentLevel.$add(thisRecord);
                    $scope.playedLevels.$remove(thisRecord);
                    $scope.randomLock = true;
            });

            } else  {

              alert('there was a problem selecting a played level')
              
            } 
          }


          // MAYBE YOU WANT TO PUT THAT RANDOM LEVEL BACK TO UNPLAYED
          $scope.putBack = function() {
            $scope.randomLock = true;
            console.log('randomLock in putBack is' + $scope.randomLock);
              if ($scope.randomLock === true) {
                $scope.currentLevel.$loaded().then(function(currentLevel) {
                  console.log(currentLevel[0]);
                  $scope.unplayedLevels.$add(currentLevel[0]);
                  $scope.currentLevel.$remove(currentLevel[0]);
                  $scope.randomLock = false;
                  console.log($scope.displayCurrentLevel);
                  });
                } else {
                  alert('there was a problem putting it back')
                }

          }

          // Maybe you refreshed the page. Need to know current level


          // IF YOU WON THE LEVEL
          $scope.winner = function() {

            if ($scope.randomLock === true) {
              $scope.currentLevel.$loaded().then(function(currentLevel) {
                  console.log(currentLevel[0].beat);
                  currentLevel[0].beat = "check green";
                  console.log(currentLevel[0].beat);
                  $scope.playedLevels.$add(currentLevel[0]);
                  $scope.currentLevel.$remove(currentLevel[0]);
                  $scope.randomLock = false;
                  $scope.displayCurrentLevel = {
                    name: '',
                    level: ''
                  };
                  console.log($scope.displayCurrentLevel);
                  });

            } else {
              alert('No current level is selected. Therefore you cannot win.')
            }
          }




          // IF YOU LOST THE LEVEL
          $scope.loser = function() {

            if ($scope.randomLock === true) {
              $scope.currentLevel.$loaded().then(function(currentLevel) {
                  console.log(currentLevel[0].beat);
                  currentLevel[0].beat = "times red";
                  console.log(currentLevel[0].beat);
                  $scope.playedLevels.$add(currentLevel[0]);
                  $scope.currentLevel.$remove(currentLevel[0]);
                  $scope.randomLock = false;
                  $scope.displayCurrentLevel = {
                    name: '',
                    level: ''
                  };
                  console.log($scope.displayCurrentLevel);
                  });

            } else {
              alert('No current level is selected. Therefore you cannot lose.')
            }
          }




          // Scary delete button
          $scope.dangerDelete = function() {
            $scope.unplayedLevels.$loaded().then(function(unplayedLevels) {
               
               for (var i = 0; i < $scope.unplayedLevels.length; i++) {
                  $scope.unplayedLevels.$remove(unplayedLevels[i]);
               }
               
               
            });
            
          };

          $scope.promptDelete = function() {
            var sure = prompt("Are you sure you want to delete all unplayed levels? Type YES below if so.");

            if (sure === "YES") {
              $scope.adminCheckDelete();
            }
          }


          
          // cute wombat test
          $scope.wombat = function() {
            console.log("wombat");
          };

          
          
        }
      ]);
      
