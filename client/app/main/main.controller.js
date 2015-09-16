'use strict';

angular.module('nightlife2App')
  .controller('MainCtrl', function($scope, $http, Auth, gmapsFactory) {

    $scope.bars = [];
    //var promise = gmapsFactory.getData()

    //console.log(gmapsFactory.getData());
    $scope.isLoggedIn = Auth.isLoggedIn;

    if (Auth.isLoggedIn()) {
      $scope.currentUser = Auth.getCurrentUser();
      //console.log('userid', $scope.currentUser._id);
    }

    // * fix this and refactor HTML template
    $scope.userIsGoing = function(bar) {
      return bar.peopleGoing.indexOf($scope.currentUser._id) > -1;
    };

    $scope.setGoing = function(bar, isGoing) {

      //var userId = $scope.currentUser._id;

      // /api/bars/going/bar_id {isGoing: true/false}
      $http.patch('/api/bars/going/' + bar._id, {
          isGoing: isGoing
        })
        .then(function ok(response) {
            //console.log(response);
            bar.peopleGoing = response.data.peopleGoing;
          },
          function err(response) {
            console.error(response);
          });

      /*
      if (isGoing) {
        bar.peopleGoing.push(userId);
        //console.log(bar.peopleGoing);
      }
      else {
        _.remove(bar.peopleGoing, function(thisUser) { return thisUser === userId; });
        //console.log(bar.peopleGoing);
      }
      */

      // pluck peopleGoing from bar and do what we need to in the database
      //var updateData = {peopleGoing: bar.peopleGoing};
      //console.log(updateData);

      // if unsuccessful reverse changes

    };



    /* test data to simulate Google return
    $scope.bars.push({
      name: 'Test Bar 1',
      place_id: 'test2',
      //peopleGoing: ['fiafia511'],
      rating: 4.1,
      user_ratings_total: 10,
      formatted_address: '51 Test Street, Testville'
    });
    $scope.bars.push({
      name: 'Testoramus',
      place_id: 'test1',
      //peopleGoing: ['haaga11', 'fiafia511'],
      rating: 2.7,
      user_ratings_total: 24,
      formatted_address: '91 Debug Alley, Testville'
    });
    $scope.bars.push({
      name: 'Bar Not In DB',
      place_id: '519testy',
      //peopleGoing: ['haaga11', 'fiafia511'],
      rating: 3.0,
      user_ratings_total: 2,
      formatted_address: '151 Bug St, Testville Greater'
    });
     end of test data */




    $scope.searchBars = function(location) {
      $scope.loading = true;
      $scope.bars = [];
      gmapsFactory.getData(location)
        .then(function(data) {
          $scope.loading = false;
          //console.log(data);
          $scope.bars = data;
          // get bars with each place id, attach info to scope
          // - this should be called after the bars list is downloaded fully
          angular.forEach($scope.bars, function(bar) {
            $http.get('/api/bars/p/' + bar.place_id).success(function(dbBar) {
              // combine dbBar into bar (i.e. dbBar._id and dbBar.peopleGoing)
              bar = _.merge(bar, dbBar);
              //console.log(dbBar);
              //console.log(bar);
            });
          });
        }, function(error) {
          console.error(error);
        });
    };

    /*
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
    */
  });
