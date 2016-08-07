var myDirectives = angular.module('cinemaghar_directives',[])
.directive('ratingDiv', function(){
  return {
    scope:{
      rating: '='
    },
    link: function($scope, tElement, tAttrs){
     $scope.$watch('rating',function(newValue, oldValue){
        if(newValue != ''){
          if( typeof($scope.rating) != "undefined"){
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
        }
      })
    }
  }
})
