<template>
  <div class="page-home">
    <h1 class="headline">{{ title }}</h1>

    <Map name="incident" :markers="this.markers"></Map>
  </div>
</template>

<script>
import Map from '@/components/organisms/Map';
import { cologneAPI } from '@/api/cologne-api';

export default {
  name: 'Home',
  data() {
    return {
      title: 'Home',
      markers: [],
    };
  },
  components: {
    Map,
  },
  async created() {
    this.getMarkers();
  },
  methods: {
    getMarkers() {
      cologneAPI.getElevators()
        .then((data) => {
          data = data.map(el => {
            el.category = "Aufzug";
            return el;
          });

          this.markers = this.markers.concat(data);
        })
        .catch((err) => {
          console.log("Error fetching Elevators", err);
        });

      cologneAPI.getEscalators()
        .then((data) => {
          data = data.map(el => {
            el.category = "Rolltreppe";
            return el;
          });

          this.markers = this.markers.concat(data);
        })
        .catch((err) => {
          console.log("Error fetching Escalators", err);
        });
    },
  },
};
</script>

<style scoped>
.page-home {
  background: white;
}
</style>
