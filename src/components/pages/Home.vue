<template>
  <div class="page-home">
    <h1 class="headline">{{ title }}</h1>

    <div>Home.vue markers: {{ this.filteredMarkers.length }}</div>

    Filter:
    <select v-model="selectedCategory">
      <option v-for="category in this.categories" v-bind:value="category.value">
        {{ category.text }}
      </option>
    </select>

    <span> ({{ this.selectedCategory }})</span>

    <Map name="incident" :markers="this.filteredMarkers"></Map>
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
      categories: [],
      category: false
    };
  },
  components: {
    Map: () => {
      return new Promise((resolve, reject) => {

        // TODO: check if script already loaded.

        let script = document.createElement("script")
        script.onload = () => {
          resolve(Map);
        }
        script.async = true;
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBGoQppKA6zpe635LYTPjl_-J4BVHEoTfM";
        document.head.appendChild(script)
      })
     }
    // Map,
  },
  async created() {
    this.categories = [
      {
        value: false,
        text: "Alle"
      },
      {
        value: "elevator",
        text: "Aufzug"
      },
      {
        value: "escalator",
        text: "Rolltreppe"
      }
    ];

    this.category = this.categories[0].value;
    this.markers = [];
    this.getMarkers();
  },
  computed: {
    selectedCategory: {
      get: function () {
        return this.category;
      },
      set: function (value) {
        this.category = value;
      }
    },
    filteredMarkers: function() {
      let filteredMarkers = this.markers;
      let selectedCategory = this.category;

      // if no category is set (false), return all markers
      if(!selectedCategory) return filteredMarkers;

      return filteredMarkers.filter(function(marker) {
        return marker.category.value == selectedCategory;
      });
    }
  },
  methods: {
    getMarkers() {
      cologneAPI.getElevators()
        .then((data) => {
          data = data.map(el => {
            el.category = {
              value: "elevator",
              text: "Aufzug"
            }

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
            el.category = {
              value: "escalator",
              text: "Rolltreppe"
            }
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
