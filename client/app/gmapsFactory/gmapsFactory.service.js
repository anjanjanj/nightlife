'use strict';

angular.module('nightlife2App')
  .factory('gmapsFactory', function($timeout, $q) {
    // Service logic
    // ...

    function getLatLng(location) {
      return $q(function(resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          'address': location
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var locationLatLng = results[0].geometry.location;
            resolve(locationLatLng);
          } else {
            reject('Error when geocoding');
          }
        });
      });
    }

    function placesRadarSearch(latLng, radius, types) {
      return $q(function(resolve, reject) {
        var service = new google.maps.places.PlacesService($('#attrib')[0]);
        service.radarSearch({
            location: latLng,
            radius: radius,
            types: types
          },
          function(results, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              reject(status);
            } else {
              //console.log("findPlaces resolved in function", results);
              resolve(results);
            }
          });
      });
    }

    function placesNearbySearch(latLng, radius, types) {
      return $q(function(resolve, reject) {
        var service = new google.maps.places.PlacesService($('#attrib')[0]);
        service.nearbySearch({
            location: latLng,
            radius: radius,
            types: types
          },
          function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              //console.log(results);
              resolve(results);
            }
            else {
              reject(status);
            }
          });
      });
    }

    function getPlacesDetail(places) {
      return $q(function(resolve, reject) {
        var results = [];
        var service2 = new google.maps.places.PlacesService($('#attrib')[0]);
        _.forEach(places, function(place) {
          //console.log(place);
          service2.getDetails({
              placeId: place.place_id
            },
            function callback(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                results.push(place);
                console.log(results.length, "results collected");
                if (results.length >= places.length) {
                  resolve(results);
                }
              }
              else {
                reject(status);
              }
            });
        });
      });
    }

    /*
    for (var i = 0, result; result = results[i]; i++) {
      //console.log(result);

      var service2 = new google.maps.places.PlacesService($('h1')[0]);
      service2.getDetails({
          placeId: result.place_id
        },
        function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            //console.log(place);


                      // grab the number of people going (also updates the scope because it's an angular function)
            $http.get('/api/bars/' + place.place_id).success(function(data) {
              //console.log(data);
              place.peopleGoing = data[0] ? data[0].peopleGoing : [];
              console.log(place.peopleGoing);
              //place.peopleGoingId = data[0] ? data[0]._id : 0;
              $scope.bars.push(place);
            });
          }
        });

    }
    */

    /*
    function getLatLng(location) {
      var defer = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var locationLatLng = results[0].geometry.location;
          defer.resolve(locationLatLng);
        } else {
          defer.reject('Error when geocoding');
        }
      });
      return defer.promise;
    }
    */

    /*
    function findPlaces(latLng, radius, types) {
      var defer = $q.defer();
      var service = new google.maps.places.PlacesService($('h1')[0]);
      service.radarSearch({
          location: latLng,
          radius: radius,
          types: types
        },
        function callback(results, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            defer.reject(status);
          } else {
            defer.resolve(results);
          }
        });
      return defer.promise;
    }
    */




    function getData(location) {

      return getLatLng(location)
        .then(function(result) {
          //console.log(result);
          //return placesRadarSearch(result, 10000, ['bar', 'night_club']);
          return placesNearbySearch(result, 10000, ['bar', 'night_club']);
        })
        //.then(function(result) {
        //  // * limit results to first 10 to avoid flooding the API!
        //  return getPlacesDetail(result.slice(0,10));
        //})
        .then(function(result) {
          //console.log(result);
          return result;
        });

      /*
      var promiseA = getLatLng('London');
      //.then(findPlaces(locationLatLng, 10000, ['bar']));
      var promiseB = promiseA.then(function(result) {
        //console.log(result);
        return findPlaces(result, 10000, ['bar']);
      });
      return promiseB.then(function(result) {
        //console.log(result);
        return result;
      });
      */

      /*
      return first()
        .then(function() {
          return second();
        }).promise;
      */

      /*
      callFirst()
      .then(function(firstResult){
         return callSecond();
      })
      .then(function(secondResult){
         return callThird();
      })
      .then(function(thirdResult){
         //Finally do something with promise, or even return this
      });
      */

      //return promiseB;
    }

    // Public API here
    return {
      getData: getData
    };
  });
