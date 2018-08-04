<template>
  <div class="page-home">
    <h1 class="headline">{{ title }}</h1>

    <Map name="incident" :markers="this.markers"></Map>
  </div>
</template>

<script>
import Map from '@/components/organisms/Map.vue';
import {cologneAPI} from '@/api/cologne-api.js';

export default {
  name: 'Home',
  data() {
    return {
      title: 'Home',
      markers: [],
    }
  },
  components: {
    Map
  },
  async created() {
    this.getMarkers();
  },
  methods: {
    getMarkers() {
      cologneAPI.getElevators().then((data) => {
        this.markers = data;
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },
};
</script>

<style scoped>
.page-home {
  background: white;
}
</style>
