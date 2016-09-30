angular.module('starter.controllers', ['cinemagharhdServices', 'facebookModule', 'ratingModule', 'pushNotificationModule'])
  .controller('AppCtrl', function($ionicSlideBoxDelegate, $injector, $ionicPopup, $ionicPlatform, $scope, $ionicModal, $timeout, $location, movieFactory, ratingService, facebookServices, pushNotificationService) {
    $scope.$on('$ionicView.enter', function(e) {
     $ionicSlideBoxDelegate.start();
    })

    $scope.loading = true;
    movieFactory.getAllMovies()
      .then(function(success){
        $scope.allMovies = success.data;
        console.log("all movies movies fetched in AppCtrl");
      },function(error){
        console.log(error);
    });

    $scope.slideHasChanged = function($index){
      if ($index + 1 == $ionicSlideBoxDelegate.slidesCount()){
        $timeout(function(){
          $ionicSlideBoxDelegate.slide(0);
        }, 3000)
      }
    }

    movieFactory.getSliderImages()
    .then(function (success){
       $scope.sliderImages = success.data;
       $timeout(function(){
        $scope.loading = false;
        $ionicSlideBoxDelegate.update();
      }, 1000);
     }, function(failure){
        console.log('fetching slider images failed ' + failure);
      });

    movieFactory.getCatagoryImages()
      .then(function(success){
        $scope.catagoryBannerImages = success.data;
      }, function(failure){
        console.log(failure);
      })

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicModal.fromTemplateUrl('templates/searchModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.searchModal = modal;
    });

    $scope.createContact = function(u) {
      $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
      $scope.searchModal.hide();
    };

    $scope.showDisclaimerModal = function (){
      $ionicPopup.show({
        title:'Disclaimer',
        templateUrl: 'templates/disclaimerModal.html',
        buttons:[{
          text:'ok'
        }]
      })
    };

    /*, {
      scope: $scope
    }).then(function(modal){
      $scope.disclaimerModal = modal;
    })*/

    $scope.data=["JavaScript","Java","Ruby","Python"];

    $scope.latestItem = function(catagory){
  	  $location.path('/itemList/'+catagory);
    };

  	$scope.ui = {};
  	$scope.ui.tabview = 'templates/tab-movie.html';
  })
  .controller('itemListCtrl', function($scope, $stateParams,$location, movieFactory){
        var catagory = $stateParams.catagory;
        $scope.catagory = $stateParams.catagory;
        $scope.loading = true;
          var movies = movieFactory.getCachedMovies.array;
          $scope.allMovies = [];
          for(i = 0; i < movies.length; i++){
            var catagories = movies[i].catagory.split(',');
            for(j = 0; j < catagories.length; j ++){
              if(catagories[j] == catagory){
                $scope.allMovies.push(movies[i]);
              }
            }
             $scope.loading = false;
          }

        $scope.homePage = function() {
          $location.path('/homePage');
        };

        $scope.playVideo =function(movie){
          console.log(movie);
      		$location.path('/player/'+movie);
        };
    })
  .controller('playerCtrl',function($scope, $ionicModal, $stateParams, movieFactory, ratingService, $sce, $ionicHistory, $ionicPopup){

        $scope.closeButtonClicked = function(){
          $scope.youtubeModal.hide();
          $scope.youtubeModal.remove();
        }

        $scope.myGoBack = function(play, movie) {
          if(play.value == true){
              console.log("backbutton tapped");
              ratingService.ratingDiag.show($scope, movie).then(function(success){
                $ionicHistory.goBack();
              }, function(error){
                $ionicHistory.goBack();
              });
            }else{
            //if the rating has not been done this triggers without
            //ratingDiag being shown
            $ionicHistory.goBack();
          }
        };
        $scope.loading = true;
        $scope.play = {};

        $scope.trailer  = function(){
            $ionicModal.fromTemplateUrl('templates/youtubeModal.html',{
            scope : $scope
          }).then(function(modal){
              $scope.youtubeModal = modal;
              $scope.youtubeModal.show();
          })
        }

        movieFactory.getAllMovies()
          .then(function(success){
            var movies = success.data;
            var id = $stateParams.movieId;
            for(i=0;i<movies.length; i++){
              if (movies[i].id == id){
                movies[i].video_link = $sce.trustAsResourceUrl(movies[i].video_link);
                $scope.movie = movies[i];
              }
            }
          },function(error){
            console.log(error);
        });
  })
  .directive('tabMenu',[function(){
      return {
        restrict:'A',
        require: 'ngModel',
        scope: { modelValue: '=ngModel' },  // modelValue for $watch
        link:function(scope, element, attr, ngModel){

            // Links collection
            var links=element.find('a');

            // Add click listeners
            links.on('click',function(e){
                e.preventDefault();
                ngModel.$setViewValue( angular.element(this).attr('href') );
                scope.$apply();
            })

            // State handling (set active) on model change
            scope.$watch('modelValue',function(){
              for(var i=0,l=links.length;i<l;++i){
                var link = angular.element(links[i]);
                link.attr('href') === scope.modelValue ?
                link.addClass('active') : link.removeClass('active')
              }
            })
        }
      }
}])
