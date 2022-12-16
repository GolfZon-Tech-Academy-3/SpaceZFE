<template>
    <div class="modal-wrapper" @dblclick="close">
        <div class="modal-dialog" @click.stop>
          <div id="kakaoMap">
            <div id="loading" v-show="loading" />
          </div>
        </div>
    </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
export default {
  setup() {
    const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
    const store = useStore();
    const { emit } = getCurrentInstance();
    const places = ref([]);
    const map = ref(null);
    const geocoder = ref(null);
    const overlay = ref(null);
    const locPosition = ref(null);
    const loading = ref(false);

    const close = () => {
      emit('close');
    }

    const initMap = () => {
        let container = document.getElementById("kakaoMap");
        let options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
  
        let maps = new kakao.maps.Map(container, options);
  
        map.value = maps;
  
        geocoder.value = new kakao.maps.services.Geocoder();

        overlay.value = new kakao.maps.CustomOverlay();
    }

    const getPos = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    const getCoordinate = async () => {
      loading.value = true;
      if (navigator.geolocation) {
        const position = await getPos();
        return {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
      }
    };

    const searchSubmit = async () => {
      await axios.get(`${proxy}/company/space/list`, {
        headers: {
          Authorization: store.state.accessToken,
        }
      }).then((res) => {
        places.value = res.data;
      })

      for(var i = 0; i < places.value.length; i++) {
            let companyName = places.value[i].companyName;
            let companyId = places.value[i].companyId;
            geocoder.value.addressSearch(places.value[i].address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                    var imageSize = new kakao.maps.Size(24, 35);
                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                    var marker = new kakao.maps.Marker({
                        map: map.value,
                        position: coords,
                        title: companyName,
                        image: markerImage,
                        clickable: false
		                });

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    let infowindow = new kakao.maps.InfoWindow({
                        content: '<div style="width:150px;text-align:center;padding:6px 0;font-size:13px;"><a style="text-decoration:none; color:black;" href="/placedetail?id='
                          + companyId + '">' + companyName +'</a></div>'
                    });
          

                    infowindow.open(map.value, marker);
                }
                
            });
        }
        const {lat, lon} = await getCoordinate();
        locPosition.value = new kakao.maps.LatLng(lat, lon);
        var nowMarker = new kakao.maps.Marker({
          position: locPosition.value,
        });
        nowMarker.setMap(map.value);
        map.value.setCenter(locPosition.value);
        await map.value.setLevel(4);
        loading.value = false;
    }

    onMounted(() => {
      initMap();
      searchSubmit();
    })
    onUnmounted(() => {
      places.value.splice(0);
      geocoder.value = null;
      overlay.value = null;
      locPosition.value = null;
    })

    return {
      close,
      initMap,
      searchSubmit,
      loading,
    }
  }
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 100;
}
.modal-dialog {
  width: 90%;
  height: 95%;
  margin: auto;
  background-color: white;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#kakaoMap {
  width: 100%;
  height: 100%;
}
#loading {
  position: fixed;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: black;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
  z-index: 1000;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>