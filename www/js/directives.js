var myDirectives = angular.module('cinemaghar_directives',[])
.directive('ratingDiv', function(){
  return {
    scope:{
      rating: '='
    },
    link: function($scope, tElement, tAttrs){
     $scope.$watch('rating',function(newValue, oldValue){
        if(newValue != ''){
          var rating = $scope.rating;
          var numDin = rating.split("/");
          var finalRating = numDin[0]/numDin[1];
          rating = Math.ceil(finalRating * 5);

          var fullStar = '<i class="icon ion-ios-star"></i>';
          var outlineStar = '<i class="icon ion-ios-star-outline"></i>';
          var stars='';

          for ( var i = 0; i < 5; i++){
            if(i < rating){
              stars += fullStar;
            }else{
              stars += outlineStar;
            }
          }
          tElement.append(stars);
        }
      })
    }
  }
})
.directive('youTube', function($window, ratingService, YouTubeLoader){
  return{
    restrict: 'E',
    transclude: true, 
    scope:
    {
      videoLink :"@",
      play: "=",
      spinner: "=",
      trailer:'@'
    },                      
    template: '<div id="player"></div>',
    link: function(tScope, tElement, tAttrs){
      YouTubeLoader
      .load
      .then(function(success){
        tScope.$watch('videoLink', function(newValue,oldValue){
           
          if(typeof(newValue) !="undefined" && newValue != ''){
            var player;
            player = new YT.Player(tElement.children()[0], {
              height: '300',
              width: '100%',
              videoId: newValue,
              events: {
                'onReady': function(event){
                    console.log('youtube player ready');
                    tScope.$apply(function(){
                      tScope.spinner = false;
                    })  
                  },
                'onStateChange': function(event){
                    console.log('code ' + event.data);
                    if (event.data == YT.PlayerState.PLAYING && !done && tScope.trailer != 'true') {
                      tScope.$apply(function(){
                        tScope.play.value = true; 
                      });
                    }      
                }
              }
            });

            var done = false;

            var stopVideo = function() {
              player.stopVideo();
            }
          }
        })

    },
    function(failure){
      console.log("Youtube api loading failed "+ failure);
    });
    }
  }
})
