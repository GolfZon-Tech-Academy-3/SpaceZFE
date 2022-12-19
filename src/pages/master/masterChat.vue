<template>
    <div style="display: flex;flex-direction: column;">
      <MenuBar />
      <div style="width: 100%;max-width: 350px;height: calc(100vh - 3.75em - 60px); max-height: 650px;margin: 0 auto;border-radius: 1em;box-shadow: 0 0 5px 0 gray;">
        <div style="width: 100%;height: 48px;background-color: #EDEDED;border-top-left-radius: 1em;border-top-right-radius: 1em;font-weight: 500;text-align: center;line-height: 48px;box-shadow: 0 0 5px 0 gray;">
          채팅방
        </div>
        <div style="width: 100%;height: calc(100% - 48px);overflow-x: hidden;overflow-y: auto;">
          <div class="chat" v-for="chat in chatrooms" :key="chat" @click="enterRoom(chat.roomId)">
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
      <div class="container" id="app" v-cloak>
      <div class="input-group">
          <div class="input-group-prepend">
              <label class="input-group-text">방제목</label>
          </div>
          <input type="text" class="form-control" v-model="room_name" v-on:keyup.enter="createRoom">
          <div class="input-group-append">
              <button class="btn btn-warning" type="button" @click="createRoom">채팅방 개설</button>
          </div>
      </div>
      </div>
      <Chatting v-if="showChatting" :sender="sender" :roomId="roomId" />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from '@/axios';
  import { useStore } from 'vuex';
  import Stomp from 'webstomp-client'
  import SockJS from 'sockjs-client'
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
  
      const createRoom = async () => {
        if("" === room_name.value) {
            alert("방 제목을 입력해 주십시요.");
            return;
        } else {
            var params = new URLSearchParams();
            params.append("name", room_name.value);
            try {
              await axios.post(`${proxy}/chat/room`, params, {
                headers: {
                  Authorization: store.state.accessToken,
                }
              })
                .then((response) => {
                        alert(response.data.name+"방 개설에 성공하였습니다.")
                        room_name.value = '';
                        findAllRoom();
                    }
                )
            } catch (error) {
              alert("채팅방 개설에 실패하였습니다."); 
              console.log(error);
            }
        }
      }
      
      const enterRoom = (id) => {
        // var inputSender = prompt('대화명을 입력해 주세요.');
        // if(inputSender != "") {
          localStorage.setItem('wschat.sender','Master');
          localStorage.setItem('wschat.roomId',id);
          // 차라리 api 요청 보내고 그 roomId 에 해당하는 채팅 내용을 불러오면서 채팅방을 열자.
          sender.value = 'Master';
          roomId.value = id;
          showChatting.value = true;
        // }
      }
  
      return {
        room_name,
        chatrooms,
        findAllRoom,
        createRoom,
        enterRoom,
        showChatting,
        sender,
        roomId,
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
  