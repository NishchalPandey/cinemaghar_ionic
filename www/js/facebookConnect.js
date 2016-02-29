
/*	This module requires facebook plugin for cordova to be installed
*	in order for it to function.
*	This service must be initiated after the device is 
* 	ready. Use of $ionicPlatform.ready(function(){ }) is
*	highly recommended.
*	
*	Author: Nishchal Pandey
*	Date: 2016-01-14
*/


var facebook = angular.module('facebookModule',[]);
facebook.factory('facebookServices',function($ionicPopup, $window, $q, $ionicPlatform, $http){

	 facebookLoginDialog = function(){
					$ionicPopup.show({
				      title: ' <p>Connect with Facebook  for  better<br> viewing experience</p>',
				      buttons: [{ 
				        text: '<img width= 200 id="facebook-connect-button" src="img/facebook-connect-button.png">',
				        type: 'button-clear',
				        onTap: function(e){
				          login();
				        }
				      }] 
				    })
				}

	simpleAlert = function(content){
		var simpleDialog = $ionicPopup.show({
	      title: content
	    })

		setTimeout(function(){
			simpleDialog.close();
		}, 2000);

	}

	apiRequestWallPost = function () {	
	    if($window.localStorage.getItem('postPermission') == null){
	        facebookConnectPlugin.api( "me/?fields=id,email,first_name", ["publish_actions"],
                  function (response) {
                        $window.localStorage.setItem("postPermission","set");
                  },
                  function (response) {
                    console.log("error occured");
                });
	        }
	    return false;
	}
	
	apiGetPublicProfile = function () { 
	    facebookConnectPlugin.api( "me/?fields=id,email,first_name,last_name", ["public_profile"],
	        function (response) {
	    		apiRequestWallPost();
	           simpleAlert("<h4 style='text-align:center'>Welcome back <br>" + response.first_name + "!</h4>");
	           var responseDb = sendUserInfoToDb(response);
	    	},
	        function (response) { 
	            simpleAlert("something went wrong");
	    	}); 
	}	
	
	login = function () {
	    facebookConnectPlugin.login( ["email"],
	        function (response) {
	    		apiGetPublicProfile();
	    	})
	
	}
	
	getStatus = function () { 
		facebookConnectPlugin.getLoginStatus( 
	        function (response) {
	                    if(response.status == "unknown"){
	                       $window.localStorage.removeItem('postPermission');
	                        facebookLoginDialog();
	                    }else{
	                    	apiGetPublicProfile();
	                    }
	        	},
	        function (response) {
	               $window.localStorage.removeItem('postPermission');
	        		facebookLoginDialog();
	        	});
	}
	
	sendUserInfoToDb = function(content){
		var postData = $.param({userInfo: content});
		$http({
			url:"http://cinemagharhd.com/php/user_validation.php",
			data: postData,
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	}

	
	
	postToFacebook = function (content , link) { 
	    facebookConnectPlugin.getAccessToken(

	        function (response) { 
	        		$http({
	        			url: "http://cinemagharhd.com/php/post_to_facebook.php",
	        			method: "GET",
	        			params: {access_token:response, text_content: content, banner_link:link}
	        		}).then(
	        			function(success){
	        				console.log('success : ' + success);
	        			},
	        			function(error){
	        				console.log('error : ' + error);
	        			}
	        		)
	        			
	        	},
	        function (response) { 
	        	simpleAlert("Unable to Post, user is not logged in!");
	        });
	}

	document.addEventListener("deviceready", function(){
		getStatus();
	}, false);

	return{
		postToFb: postToFacebook,
		login: login
	}

});