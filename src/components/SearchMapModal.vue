<template>
    <div class="modal-wrapper" @dblclick="close">
        <div class="modal-dialog" @click.stop>
          <div id="kakaoMap">
          </div>
        </div>
    </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from 'vue';
export default {
  props: {
    placeInfo: {
      type: Array,
      required: true,
    }
  },
  setup(props) {
    const { emit } = getCurrentInstance();
    const places = ref(props.placeInfo);
    const map = ref(null);
    const geocoder = ref(null);
    const overlay = ref(null);

    const close = () => {
      emit('close');
    }

    //맵 초기화
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

    //장소들로 위치 좌표 찍기
    const searchSubmit = () => {
      for(var i = 0; i < places.value.length; i++) {
            let companyName = places.value[i].companyName;
            let companyId = places.value[i].companyId;
            var bounds = new kakao.maps.LatLngBounds();
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
                    bounds.extend(coords);
                }
                map.value.setBounds(bounds);
            });
        }
      
    }

    onMounted(() => {
      initMap();
      searchSubmit();
    })

    return {
      close,
      initMap,
      searchSubmit,
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
  z-index: 1000;
}
#kakaoMap {
  width: 100%;
  height: 100%;
}
</style>