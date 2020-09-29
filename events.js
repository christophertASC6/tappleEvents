// Initialize Firebase (ADD YOUR OWN DATA)
var config = {
    apiKey: "AIzaSyBO9QueJL21b8oh4w_BoIp4PJXm1tup3LA",
    authDomain: "eventspage-6bfe2.firebaseapp.com",
    databaseURL: "https://eventspage-6bfe2.firebaseio.com",
    projectId: "eventspage-6bfe2",
    storageBucket: "eventspage-6bfe2.appspot.com",
    messagingSenderId: "930597125548"
  };
  firebase.initializeApp(config);


var rootRef = firebase.database().ref().child("messages");

rootRef.on('child_added', snap => {
  fetch('scenarios.json')
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {

  var name = snap.child("name").val();
  var eventTitle = snap.child("eventTitle").val();
  var date = snap.child("date").val();
  var time = snap.child("time").val();
  var scenarios = snap.child("scenarios").val();
  var gameType = snap.child("gameType").val();
  var teamSize = snap.child("teamSize").val();
  var experimentalIndex = snap.child("experimenalIndex").val();
  var playerFill = snap.child("playerFill").val();
  var arr = scenarios.split(', '); // split string on comma space

  var res = date.concat(" ", time);
  var timer = moment(res).fromNow()
  console.log(res);

  var gameTime = ((new Date(res).getTime() + 3600000)/1000);
  var nowTime = ((new Date().getTime())/1000);
  console.log(gameTime);
  console.log(nowTime);

  if (nowTime >= gameTime) {
    firebase.database().ref().child("messages").remove();
  }
  
  var mainContainer = document.getElementById("myData");
  for (var i = 0; i < data.length; i++) {
    if (arr[1] == data[i].name) {
      description = data[i].description;
      $("#description").append(`
        <li><a href="#" class="green" data-toggle="tooltip" title="${description}"></a></li>
      `)
    }
  }

  if (gameType == "FFA") {
    teamSize = " ";
  }

  $("#event").append(`
  <div class="card-main">
    <div class="card-head">
      <img src="tapple-logo.png" alt="logo" class="card-logo">
      <div class="product-detail">
        <h2>Upcoming Events</h2> 
      </div>
    </div>
    <div class="card-body-1">
      <div class="product-desc">
        <span class="product-title">
          <b><p style="width:auto; float: left;">${eventTitle}</p></b>
            <span class="badge">
                 New
               </span>
               <span class="product-caption">
                  <b>${date} - ${time}</b>
               </span> <br />
               <span class="product-caption">
                  <b>>> ${timer}</b>
              </span>
               <b><p class = "product-name">HOSTED BY: ${name}</p></b>
          </span>
        </div>
        <div class="product-properties">
          <span class="product-size">
            <span class="product-rating">
            <i class="fa fa-star"></i> - Stats will be <b>on</b>
              </span>
                  <ul class="ul-size">
                    <span class="badge-info">
                      ${gameType} ${teamSize}
                    </span>
                    <span class="badge-info">
                      2000x2000
                    </span>
                    <span class="badge-info">
                      Events-1
                    </span>
                    <span class="badge-info">
                      Player Fill: ${playerFill}
                    </span>
                </ul>
              </span>
        <span class="product-color">
                <h4><a href="#" data-toggle="tooltip" title="${scenarios}">Scenarios</a></h4>
                <ul class="ul-color">
                  <li><a href="#" class="orange" data-toggle="tooltip"></a></li>
                  <li><a href="#" class="green" data-toggle="tooltip"></a></li>
                  <div id="description"></div>
                </ul>
               </span>
        <span class="product-price">
                <b>MORE INFO</b>
            </span>
      </div>
    </div>
  </div>
`);
});
  })
  .catch(function (err) {
      console.log('error: ' + err);
});