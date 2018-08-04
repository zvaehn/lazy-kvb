<template>
  <div class="map" :id="mapName"></div>
</template>

<script>
export default {
  name: 'Map',
  data: function () {
    return {
      mapName: this.name + "-map",
      map: null,
      bounds: null
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    markers: {
      type: Array
    }
  },
  created: function() {

  },
  mounted: function () {
    this.bounds = new google.maps.LatLngBounds();

    const element = document.getElementById(this.mapName);
    const cologne = { lat: 50.9471066, lng: 6.9571989 };

    const options = {
      center: new google.maps.LatLng(cologne.lat, cologne.lng)
    }

    this.map = new google.maps.Map(element, options);

    this.markers.forEach((el) => {
      const coords = el.geometry.coordinates;
      const position = new google.maps.LatLng(coords[0], coords[1]);
      const marker = new google.maps.Marker({
        position,
        map: this.map
      });

      this.markers.push(marker);
      this.map.fitBounds(this.bounds.extend(position));
    });
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
