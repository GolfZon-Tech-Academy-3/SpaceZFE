<template>
  <div style="display: flex;flex-direction: column;">
    <MenuBar />
    <div class="container" id="app">
      <ul class="list-group">
          <li @click="enterRoom(item.roomId)" class="list-group-item list-group-item-action" v-for="item in chatrooms" :key="item.roomId">
                {{item.name}}
          </li>
      </ul>
    </div>
    <Chatting v-if="showChatting" :sender="sender" :roomId="roomId" />
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
import MenuBar from "./menuBar.vue";
import Chatting from "@/components/Chatting.vue";

export default {
  components: {
    MenuBar,
    Chatting,
  },
  setup() {
    const store = useStore();
    const room_name = ref('');
    const chatrooms = ref([]);
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const sender = ref('');
    const roomId = ref('');
    const showChatting = ref(false);

    const findAllRoom = async () => { 
      await axios.get(`${proxy}/chat/rooms`, {
                headers: {
                    Authorization: store.state.accessToken
                }
            })
        .then((res) => {
          chatrooms.value = res.data;
          console.log(res.data);
        });
    }
    
    findAllRoom();
    
    const enterRoom = (id) => {
        localStorage.setItem('wschat.sender','Manager');
        localStorage.setItem('wschat.roomId',id);
        // 차라리 api 요청 보내고 그 roomId 에 해당하는 채팅 내용을 불러오면서 채팅방을 열자.
        sender.value = 'Manager';
        roomId.value = id;
        showChatting.value = true;
     
    }

    return {
      room_name,
      chatrooms,
      findAllRoom,
      enterRoom,
      showChatting,
      sender,
      roomId,
    }
  } 
};
</script>

<style></style>
