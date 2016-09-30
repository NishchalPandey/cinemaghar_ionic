var pushNotMod = angular.module('pushNotificationModule', []);
pushNotMod.factory('pushNotificationService', function($q, $ionicPopup){

    var deferred  = $q.defer();
    document.addEventListener("deviceready", function(){
        deferred.resolve(PushNotification);
        var platform = ionic.Platform.platform();
        var push = PushNotification.init({ "android":
                                                                    {"senderID": "714035949489"},
                                                    "ios":
                                                        {"alert": "true",
                                                        "badge": "true",
                                                        "sound": "true"},
                                                        "windows": {} } );
                 push.on('registration', function(data) {
                     var register_id = data.registrationId;
                         var data = {user_app_id: register_id, platform: platform};
                     $.ajax({
                         url:"http://cinemagharhd.com/php/register_user_app.php",
                         type:"POST",
                         data: data,
                         success: function(data){
                            console.log("Device successfully registered : "+ JSON.stringify(data));
                          }
                     });
                 });

                 push.on('notification', function(data) {
                    console.log("notification event :");
                     console.log(JSON.stringify(data));

                     $ionicPopup.show({
                        title: "<h4><span class='title'>Alert!</span></h4>",
                        template: "<span>"+data.message+"</span>",
                        buttons:[{
                            text:'OK',
                            type: "button-positive"
                        }]
                     })

                         push.finish(function () {
                     });
                 });

                 push.on('error', function(e) {
                     console.log("push error");
                 });
}, false);

return deferred.promise;

});
