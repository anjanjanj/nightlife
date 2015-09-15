'use strict';

angular.module('nightlife2App')
  .factory('gmapsFactory', function ($timeout, $q) {
    // Service logic
    // ...

    function getLatLng(location) {
      var defer = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var locationLatLng = results[0].geometry.location;
          defer.resolve(locationLatLng);
        }
        else {
          defer.reject('Error when geocoding');
        }
      });
      return defer.promise;
    }

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
          }
          else {
            defer.resolve(results);
          }
        });
        return defer.promise;
      }




    function getData() {
      var data =  getLatLng('London');
                  //.then(findPlaces(latLng, 10000, ['bar']));

      return data;
    }

    /*
    function codeAddress(loc) {
      //var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var geocoder = new google.maps.Geocoder();
      var address = loc;

      geocoder.geocode({
        'address': address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var locationLatLng = results[0].geometry.location;
          //console.log(results[0].geometry.location);

          var service = new google.maps.places.PlacesService($('h1')[0]);
          service.radarSearch({
              location: locationLatLng,
              radius: 10000,
              types: ['bar']
            },
            function callback(results, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.error(status);
                return;
              }
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
            });

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
    */

    // * make this into a wrapper function to do everything when passed the location string
    /*
    function getData() {
      //return function() {
        var defer = $q.defer();

        // simulated async function
        $timeout(function() {
          if(Math.round(Math.random())) {
            defer.resolve('data received!');
          } else {
            defer.reject('oh no an error! try again');
          }
        }, 2000);
        return defer.promise;
      //};
    }
    */

    // Public API here
    return {
      getData: getData
    };
  });
