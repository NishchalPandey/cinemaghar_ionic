var ratingModule = angular.module('ratingModule',[]);

ratingModule.service('ratingService', function($ionicModal, facebookServices, movieFactory,$q){

	this.ratingDiag = {
		show: function(scope, movie){
			var deferred = $q.defer();
			scope.rating = {};
			scope.rating.value = 0;
				$ionicModal.fromTemplateUrl('templates/ratingModal.html',{
		      scope: scope
		    }).then(function(modal){
	        scope.ratingModal = modal;
	        scope.ratingModal.show();
					scope.ratingDone = function(){
						ratingVal = 3;
						console.log('clicked I am ');
						var ratingVal = scope.rating.value;
						var movieTitle = movie.name;
						var banner_link = movie.banner_name;

						facebookServices.postToFb(movieTitle, ratingVal, banner_link);
						movieFactory.sendRatingToDb(ratingVal, movieTitle);
						scope.rating.done = true;
						scope.ratingModal.remove();
						deferred.resolve(ratingVal);
					}

					scope.closeButtonClicked = function(e){
						scope.ratingModal.remove();
						deferred.resolve();
					}
	    })
			return deferred.promise;
		}
	}
});

ratingModule.directive('ratingSelectionStars',function(){
    	return{
    		restrict: 'E',
    		scope:{
    			rating: '='
    		},
    		compile: function (tElement, tAttrs){

    			var getStar = function(i) {
    				var star = angular.element('<img>');
    				star.attr({
    						'src':"img/ratingStars/outline-star-xxl.png",
    						'index': i
    					})
    					.css('width', "40px")
    					return star;
    				}
    			for(i = 1; i <= 5; i ++){
    				tElement.append(getStar(i));
    			}

    			return function(tScope, tElement, tAttrs){

    			 	tElement.on('click',function(e){
							e.preventDefault();
    				var index = angular.element(e.target).attr('index');
    				var stars = tElement.children();
    					for (i=0; i < 5; i ++){
    						if(i < index)
    							stars[i].src = "img/ratingStars/Star-Full-icon.png";
    						else
    							stars[i].src = "img/ratingStars/outline-star-xxl.png";
    					}

    					tScope.$apply(function(){
    						tScope.rating = index;
    					});
    				});
    			}
    		}
    	}
    })
