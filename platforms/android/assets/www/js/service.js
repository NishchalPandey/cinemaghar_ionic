var cinemagharhdServicesModule = angular.module('cinemagharhdServices',[]);
cinemagharhdServicesModule.factory('movieFactory',
['$http', function($http){
  var movies = {};
  var getAllMovies = function(){
                        return $http.get('http://cinemagharhd.com/php/pull_movies.php?type=catagory&string=all')
                                  .then(function(success){
                                    movies.array = success.data;
                                     return success;
                                  }, function(failure){
                                    console.log('error in cinemagharhdServices -> getAllMovies function');
                                  })
                        }
  return {
    getAllMovies: getAllMovies,
    getCachedMovies : movies,

    getMovies: function(catagory){
        return $http.get('http://cinemagharhd.com/php/pull_movies.php?type=catagory&string='+catagory)
    },

    sendRatingToDb : function(ratingVal, movieTitle){
        var postData = $.param({rating: ratingVal, movie_name: movieTitle});
        $http({
               url: "http://cinemagharhd.com/php/submit_rating.php",
               data: postData,
               method: "POST",
               headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
      },
    getSliderImages: function(){
      return $http.get("http://cinemagharhd.com/php/pull_slider_images_v2.php");
    },

    getCatagoryImages: function(){
      return $http.get("http://cinemagharhd.com/php/getCatagoryImages.php");
    }
  }
}]);
cinemagharhdServicesModule.factory('YouTubeLoader', function($q, $window) {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var loaded = false;
    var delay = $q.defer();
    
  $window.onYouTubeIframeAPIReady = function() {
    if (!loaded) {
      loaded = true;
      delay.resolve();
    } 
  }
return {
    load: delay.promise
  }
});