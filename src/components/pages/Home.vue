<template>
  <div class="page-home">
    <h1 class="headline">{{ title }}</h1>

    <p>Es liegen zur Zeit <strong>{{ this.markers.length }}</strong> Störungen vor.</p>

    <p>
      Störung filtern nach:
      <select v-model="selectedCategory">
        <option v-for="category in this.categories" v-bind:value="category.value">
          {{ category.text }}
        </option>
      </select>
    </p>

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
      title: 'Übersicht der KVB Aufzugs- und Rolltreppenstörungen in Köln',
      markers: [],
      categories: [],
      category: false
    };
  },
  components: {
    Map: () => {
      return new Promise((resolve, reject) => {
        let script = document.createElement("script")
        script.onload = () => {
          resolve(Map);
        }
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GMAPS_API_KEY}`;
        document.head.appendChild(script)
      })
    }
  },
  created() {
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
  },
  mounted() {
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
