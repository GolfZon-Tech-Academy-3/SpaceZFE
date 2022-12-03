<template>
  <div id="app">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  name: "app",
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.initMap();
    this.searchSubmit();
  },
  methods: {
    initMap() {
      let container = document.getElementById("map");
      let options = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 5,
      };

      let map = new kakao.maps.Map(container, options);

      this.map = map;

      this.geocoder = new kakao.maps.services.Geocoder();
    },
    searchSubmit() {
      const { location } = this.options;
      console.log(this.options);
      this.geocoder.addressSearch(location, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          let bounds = new kakao.maps.LatLngBounds();

          for (let i = 0; i < result.length; i++) {
            let data = result[i];
            bounds.extend(new kakao.maps.LatLng(data.y, data.x));
            var marker = new kakao.maps.Marker({
              map: this.map,
              position: new kakao.maps.LatLng(data.y, data.x),
            });
          }

          this.map.setBounds(bounds);
          map.relayout();
        }
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 30vw;
  height: 60vh;
  /* top: 20px;
  left: 170px; */
}
</style>
