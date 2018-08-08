<template>
  <div>
    <div>Map.vue markers: {{ this.getMarkers.length }} </div>
    <div class="map" :id="mapName"></div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      mapName: this.name + "-map",
      map: null,
      bounds: null,
      mapMarkers: [],
      infowindows: []
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    markers: {
      type: Array,
      default: []
    }
  },
  computed: {
    getMarkers: function () {
      if(this.markers.length) {
        this.updateMap();
      }

      return this.markers;
    }
  },
  methods: {
    cleanMarker: function() {
      this.mapMarkers = this.mapMarkers.map(marker => {
        marker.setMap(null);
        return marker;
      });
    },
    cleanInfowindows: function() {
      this.infowindows.forEach((el) => {
        el.close();
      });
    },
    updateMap: function() {
      if(!this.map) return;

      this.cleanMarker();

      this.markers.forEach((el) => {
        if(!el.geometry) return;

        const coords = el.geometry.coordinates;
        const properties = el.properties;
        const position = new google.maps.LatLng(coords[1], coords[0]);

        const iconBase = './static/icons/';
        const icons = {
          elevator: {
            icon: iconBase + 'marker-elevator-colored.png'
          },
          escalator: {
            icon: iconBase + 'marker-escalator-colored.png'
          },
        };

        const icon = {
          url: icons[el.category.value].icon,
          scaledSize: new google.maps.Size(40, 64),
          // origin: new google.maps.Point(0,0),
          // anchor: new google.maps.Point(0,0)
        };

        const marker = new google.maps.Marker({
          position: position,
          icon: icon,
          map: this.map
        });

        // const dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        // const date = dateFormat.parse(properties.timestamp);//You will get date object relative to server/client timezone wherever it is parsed
        // const formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //If you need time just put specific format for time like 'HH:mm:ss'
        // const prettyTime = formatter.format(date);
        let content = "<strong>" + el.category.text + "</strong><br>";
        content += properties.Bezeichnung + "<br><br>";
        content += "<small>" + properties.timestamp + "</small>";

        const infowindow = new google.maps.InfoWindow({
          content: content
        });

        this.infowindows.push(infowindow);
        let that = this;

        marker.addListener('click', function() {
          that.cleanInfowindows();
          infowindow.open(this.map, this);
        });

        this.mapMarkers.push(marker);
        this.bounds.extend(position);
        return;

        this.map.fitBounds(this.bounds);
      });
    }
  },
  beforeUpdate: function() {

  },
  created: function() {
    // component created
  },
  mounted: function () {
    this.bounds = new google.maps.LatLngBounds();

    const element = document.getElementById(this.mapName);
    const cologne = { lat: 50.9471066, lng: 6.9571989 };

    const options = {
      zoom: 14,
      center: new google.maps.LatLng(cologne.lat, cologne.lng)
    }

    this.map = new google.maps.Map(element, options);
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 600px;
  margin: 0 auto;
  background: gray;
}
</style>
