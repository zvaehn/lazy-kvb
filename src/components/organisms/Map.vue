<template>
  <div>
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
    },
    infowindows: {
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
      zoom: 10,
      center: new google.maps.LatLng(cologne.lat, cologne.lng)
    }

    this.map = new google.maps.Map(element, options);

    console.log(this.markers);

    this.markers.forEach((el) => {
      const coords = el.geometry.coordinates;
      const properties = el.properties;
      const position = new google.maps.LatLng(coords[1], coords[0]);
      const marker = new google.maps.Marker({
        position,
        map: this.map
      });

      // const dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
      // const date = dateFormat.parse(properties.timestamp);//You will get date object relative to server/client timezone wherever it is parsed
      // const formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //If you need time just put specific format for time like 'HH:mm:ss'
      // const prettyTime = formatter.format(date);

      const infowindow = new google.maps.InfoWindow({
        content: "<strong>" + el.category + "</strong><br>" + properties.Bezeichnung
      });

      marker.addListener('click', function() {
        infowindow.open(this.map, this);
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
