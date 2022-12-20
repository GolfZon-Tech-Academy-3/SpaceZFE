<template>
  <div id="app">
    <div id="map" @click="click"></div>
  </div>
</template>

<script>
export default {
  props: ["options", "arounds", "reset", "level", "aroundType"],
  watch: {
    arounds: function () {
      this.getArround();
      this.drawCircle();
    },
    reset: function () {
      this.removeMarkers();
    },
  },
  name: "app",
  data() {
    return {
      map: null,
      arrounds: [{ x: 0, y: 0 }],
      markers: [],
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
        level: this.options.level,
      };
      let map = new kakao.maps.Map(container, options);
      this.map = map;
      this.geocoder = new kakao.maps.services.Geocoder();
    },
    searchSubmit() {
      const { location } = this.options;
      const image = require("@/assets/place.png");
      const imageSize = new kakao.maps.Size(24, 35);
      const imageSrc = new kakao.maps.MarkerImage(image, imageSize);

      this.geocoder.addressSearch(location, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          let bounds = new kakao.maps.LatLngBounds();

          for (let i = 0; i < result.length; i++) {
            let data = result[i];
            bounds.extend(new kakao.maps.LatLng(data.y, data.x));
            var marker = new kakao.maps.Marker({
              map: this.map,
              position: new kakao.maps.LatLng(data.y, data.x),
              image: imageSrc,
            });
          }
          this.map.setBounds(bounds);
          this.$emit("x", result[0].x);
          this.$emit("y", result[0].y);
          console.log(this.options);
        }
      });
    },
    getArround() {
      this.arrounds = this.arounds;

      let imageSrc;

      //이미지 선택 함수
      if (this.aroundType == "CS2") {
        // image = require("@/assets/store.png");
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/store.png"),
          new kakao.maps.Size(20, 30)
        );
        console.log(imageSrc);
        console.log(this.arounds);
      } else if (this.aroundType == "SW8") {
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/subway.png"),
          new kakao.maps.Size(20, 30)
        );
      } else if (this.aroundType == "AD5") {
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/domi.png"),
          new kakao.maps.Size(20, 30)
        );
      } else if (this.aroundType == "FD6") {
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/food.png"),
          new kakao.maps.Size(20, 30)
        );
      } else if (this.aroundType == "CE7") {
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/cafe.png"),
          new kakao.maps.Size(20, 30)
        );
      } else if (this.aroundType == "PK6") {
        imageSrc = new kakao.maps.MarkerImage(
          require("@/assets/parking.png"),
          new kakao.maps.Size(20, 30)
        );
      }
      for (let i = 0; i < this.arounds.length; i++) {
        let marker = new kakao.maps.Marker({
          map: this.map,
          position: new kakao.maps.LatLng(this.arounds[i].y, this.arounds[i].x),
          title: this.arounds[i].place_name,
          image: imageSrc,
        });
        let infoWindow = new kakao.maps.InfoWindow({
          // content: `현재 장소 부터 목적지 까지 거리: ${this.arounds[i].distance}`,
          position: new kakao.maps.LatLng(this.arounds[i].y, this.arounds[i].x),
          removable: true,
        });

        this.markers[i] = marker;
        kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.setContent(
            `
                      <div  style='padding: 3%;
            width: fit-content;
            height: fit-content;
            white-space: nowrap;
            background: white;
            color: black;
            border:1px solid black'>
               <span class="nowLoc"> <b style="font-size:1em;">현재 장소:</b>${this.options.location}</span> 
              <br>
              <span class="goal"><b style="font-size:1em;">목적지:</b> ${this.arounds[i].place_name}</span>
              <br>
              <span class="distance"><b style="font-size:1em;">거리:</b> ${this.arounds[i].distance}m</span>
              </div>
              `
          );
          infoWindow.open(this.map, marker);
        });
      }

      let mapLevel;
      if (this.level == 100) {
        mapLevel = 2;
      } else if (this.level == 200) {
        mapLevel = 3;
      } else if (this.level == 300) {
        mapLevel = 4;
      } else if (this.level == 500) {
        mapLevel = 5;
      }

      this.drawCircle();
      this.map.setLevel(mapLevel);
      console.log(this.arounds);
    },

    drawCircle() {
      let circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(
          // 33.450701,
          // 126.570667
          this.options.center.lat,
          this.options.center.lng
        ),
        radius:
          // 100,
          this.level / 2,
        strokeWeight: 5,
        strokeColor: "#75B8FA",
        strokeOpacity: 1,
        strokeStyle: "dashed",
        fillOpacity: 0.7,
      });
      circle.setMap(this.map);
    },
    removeMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    },
  },
};
</script>

<style>
#map {
  width: 40%;
  height: 60vh;
  /* top: 20px;
  left: 170px; */
}
.overlay {
  padding: 3%;
  width: fit-content;
  height: fit-content;
  white-space: nowrap;
  background: white;
  color: black;
}
.nowLoc {
  font-size: 0.6em;
}
.goal {
  font-size: 0.6em;
}
.distance {
  font-size: 0.6em;
}
@media all and (max-width: 768px) {
  #map {
    width: 80%;
    height: 60vh;
    /* top: 20px;
  left: 170px; */
  }
}
</style>
