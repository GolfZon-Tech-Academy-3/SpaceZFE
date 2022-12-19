<template>
    <div style="display: flex;flex-direction: column;">
      <MenuBar />
      <div style="width: 100%;max-width: 350px;height: calc(100vh - 3.75em - 60px); max-height: 650px;margin: 0 auto;border-radius: 1em;box-shadow: 0 0 5px 0 gray;">
        <div style="width: 100%;height: 48px;background-color: #EDEDED;border-top-left-radius: 1em;border-top-right-radius: 1em;font-weight: 500;text-align: center;line-height: 48px;box-shadow: 0 0 5px 0 gray;">
          채팅방
        </div>
        <div style="width: 100%;height: calc(100% - 48px);overflow-x: hidden;overflow-y: auto;">
          <div class="chat" v-for="chat in chattings" :key="chat" @click="enterRoom(chat.name, chat.roomId)">
            <div style="width: 100%;height: 50%;">
              {{chat.name}}
              <span style="float: right;font-size: 0.8em;color: gray;">2022-12-22 09:00</span>
            </div>
            <div style="width: 100%;height: 50%;color: gray;font-size: 0.8em;">
              마지막 채팅 내용
              <span style="float:right;background-color: red;color: white;padding: 0 5.7px;border-radius: 50%;">1</span>
            </div>
          </div>
        </div>
      </div>
      <Chatting v-if="showChatting" :roomInfo="roomInfo" @close="close" />
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
      const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
      const chattings = ref([]);
      const roomInfo = ref({});
      const showChatting = ref(false);
  
      const findAllRoom = async () => { 
        await axios.get(`${proxy}/chat/rooms`, {
                  headers: {
                      Authorization: store.state.accessToken
                  }
              })
          .then((res) => {
            chattings.value = res.data;
          });
      }
      
      findAllRoom();
      
      const enterRoom = (name, id) => {
          showChatting.value = true;
          roomInfo.value['sender'] = 'master';
          roomInfo.value['roomId'] = id;
          roomInfo.value['roomName'] = name;
      }
  
      const close = () => {
        showChatting.value = false;
      }

      return {
        chattings,
        showChatting,
        roomInfo,
        findAllRoom,
        enterRoom,
        close,
      }
    } 
  };
  </script>
  
<style scoped>
.chat {
  width: calc(100% - 20px);
  height: 40px;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid gray;
}
.chat:hover {
  background-color: black;
  color: white;
  box-shadow: 0 0 5px 0 gray;
}
</style>
  