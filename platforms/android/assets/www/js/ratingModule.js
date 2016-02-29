var ratingModule = angular.module('ratingModule',[]);

ratingModule.service('ratingService', function($ionicPopup, facebookServices, movieFactory,$q){
	
	this.ratingDiag = {
		show: function(scope, movie){

			var deferred = $q.defer();
			scope.rating ={};
			scope.rating.value = 0;
			$ionicPopup.show({
				title: "How would you rate this movie?",
				template: 	'<span align="right">'+
							'<rating-stars rating="rating.value"></rating-stars>'+
							'</span>',
				scope: scope,
				buttons:[{
					text:"Ok",
					type:'button-positive',
					onTap: function(e){
						var ratingVal = scope.rating.value;
						var movieTitle = movie.name;
						var stars = '';
						var banner_link = movie.banner_name;

						for (i = 1; i <= 5; i++)
							if(i <= ratingVal)
								stars = stars + "\u2605";
							else
								stars = stars + "\u2606";
							
						facebookServices.postToFb("I watched and rated \""+ movieTitle +"\" "+stars+ " on Cinemaghar www.cinemagharhd.com", banner_link);
						movieFactory.sendRatingToDb(ratingVal, movieTitle);
						scope.rating.done = true;
						deferred.resolve(ratingVal);
					}
				}]
			});
			return deferred.promise;
		}

	}
	
});

ratingModule.directive('ratingStars',function(){
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