<template>
  <div>
    <!-- <p v-if="this.$parent.selectedCategory !== false">Es werden <strong>{{ this.getMarkers.length }}</strong> gefilterte Störungen auf der Karte angezeigt.</p>
    <p v-else>Es werden <strong>{{ this.getMarkers.length }}</strong> Störungen auf der Karte angezeigt.</p> -->

    <div class="map" :id="mapName"></div>
  </div>
</template>

<script>
require('gmaps-marker-clusterer');

export default {
  name: 'Map',
  data() {
    return {
      mapName: this.name + "-map",
      map: null,
      markerCluster: null,
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
  watch: {
    markers: function() {
      this.updateMap();
      return this.markers;
    }
  },
  computed: {
    // getMarkers: function () {
    //   console.log("computed prop. getMarkers called.");
    //
    //   if(this.markers.length) {
    //     // this.updateMap();
    //   }
    //
    //   return this.markers;
    // }
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

      this.mapMarkers = [];
      this.markerCluster.clearMarkers();

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
        };

        const marker = new google.maps.Marker({
          position: position,
          icon: icon,
          map: this.map
        });

        let content = "<strong>" + el.category.text + "</strong><br>";
        content += properties.Bezeichnung + "<br><br>";
        content += "<small>Letzte Aktuslisierung " + this.$moment(properties.timestamp).fromNow() + "</small>";

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
        this.map.fitBounds(this.bounds);

        if(this.markerCluster) {
          this.markerCluster.addMarker(marker);
        }
      });
    }
  },
  beforeUpdate: function() {

  },
  created: function() {

  },
  mounted: function () {
    let that = this;
    this.bounds = new google.maps.LatLngBounds();

    const element = document.getElementById(this.mapName);
    const cologne = { lat: 50.9471066, lng: 6.9571989 };

    const options = {
      zoom: 13,
      center: new google.maps.LatLng(cologne.lat, cologne.lng)
    }

    this.map = new google.maps.Map(element, options);

    this.getMarkers;

    let mcOptions = {
      gridSize: 50,
      styles: [
        {
          textColor: '#761412',
          url: 'static/icons/marker-cluster.png',
          height: 66,
          width: 65
        }
      ],
      maxZoom: 15
    };

    this.markerCluster = new MarkerClusterer(this.map, this.mapMarkers, mcOptions);
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
