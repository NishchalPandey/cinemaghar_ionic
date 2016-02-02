var pushNotMod = angular.module('pushNotificationModule', []);
    pushNotMod.factory('pushNotificationService', function($q){

        var deffered  = $q.defer();
        document.addEventListener("deviceready", function(){
            deffered.resolve(PushNotification);
            var push = PushNotification.init({ "android": 
                                                            {"senderID": "714035949489"},
                                                        "ios": 
                                                            {"alert": "true", 
                                                            "badge": "true", 
                                                            "sound": "true"}, 
                                                            "windows": {} } );
                     push.on('registration', function(data) {
                         var register_id = data.registrationId;
                         var data = {user_app_id: register_id};
                         $.ajax({
                             url:"http://cinemagharhd.com/php/register_user_app.php",
                             type:"POST",
                             data: data,
                             success: function(data){
                                console.log("Device successfully registered : "+ JSON.stringify(data));
                              }
                         });
                         console.log("registration event fired");
                         console.log(JSON.stringify(data));
                     });

                     push.on('notification', function(data) {
                        console.log("notification event :");
                         console.log(JSON.stringify(data));
                         alert('message : ' + data.message +' title : '+ data.title);
                         push.finish(function () {
                             console.log('finish successfully called');
                         });
                     });

                     push.on('error', function(e) {
                         console.log("push error");
                     });
    }, false);
    
    return deffered.promise;

    });	
         
    