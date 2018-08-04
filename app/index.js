// import moment from 'vue-moment';

var app = new Vue({
  el: '#app',
  data: {
    elevators: [],
    escalators: []
  },
  created() {
    //fetch('http://online-service.kvb-koeln.de/geoserver/OPENDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODENDATA%3Afahrtreppen_gestoert&outputFormat=application/json')
    fetch('https://api.myjson.com/bins/zz494')
      .then(response => response.json())
      .then(json => {
        this.elevators = json.features
      })
  }
});


// window.addEventListener('load', function () {
//   var moments = document.querySelectorAll('[data-moment]');
//   console.log(moments);
//
//   for(var i = 0; i < moments.length; i++) {
//     console.log(moments[i]);
//   }
// });
