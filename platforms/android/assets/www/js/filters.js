var textFilterModule = angular.module('filterModule', [])
	.filter('capitalizeFirstLetter', function(){
		return function(input){
			var words = input.split(' ');
			var fullSentence = '';
			words.forEach(function(word){
				fullSentence = fullSentence + word[0].toUpperCase() + word.substring(1) + ' ';
			})
			return fullSentence;
		}
	});
