<template>
  <div style="display: flex;flex-direction: column;">
    <MenuBar />
    <div>
      <div style="width: 100%;max-width: 350px;height: calc(100vh - 3.75em - 60px); max-height: 650px;margin: 0 auto;border-radius: 1em;box-shadow: 0 0 5px 0 gray;">
        <div style="width: 100%;height: 48px;background-color: #EDEDED;border-top-left-radius: 1em;border-top-right-radius: 1em;font-weight: 500;text-align: center;line-height: 48px;box-shadow: 0 0 5px 0 gray;">
          마스터와의 채팅
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 96px);overflow-x: hidden;overflow-y: auto;position: relative;">
            <div v-for="talk in talks" :key="talk" style="width: calc(100% - 1em);height: auto;text-align: left;padding: 0.5em;position: relative;">
                <div :style="[talk.sender !== 'master' ? 'text-align:right;' : '']" v-if="talk.sender !== '[알림]'">{{ talk.sender }}</div>
                <span v-if="talk.sender !== '[알림]'" :style="[talk.sender !== 'master' ? 'float :left;' : 'float:right;']">{{ talk.createdAt }}</span>
                <div :class="[talk.sender === '[알림]' ? 'alert' : (talk.sender !== 'master' ? 'send' : 'receive')]">
                    {{talk.message}}
                </div>
            </div>
        </div>
        <div style="width: 100%;height: 48px;line-height: 48px;background-color: #EDEDED;border-bottom-left-radius: 1em;border-bottom-right-radius: 1em;box-shadow: 0 0 5px 0 gray;text-align: center;">
            <input :disabled="disabled" @keyup.enter="sendMessage" style="padding: 0.5em;border-radius: 1em;border: none;box-shadow: 0 0 5px 0 gray;width: calc(100% - 100px);" type="text" placeholder="메시지를 입력하세요" v-model="input">
            <button class="submit" type="button" @click="sendMessage">전송</button>
        </div>
      </div>
    </div>
    <div id="loading" v-show="disabled" />
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
import MenuBar from "./menuBar.vue";
import Chatting from "@/components/Chatting.vue";
import Stomp from 'webstomp-client';
import SockJS from 'sockjs-client';

export default {
  components: {
    MenuBar,
    Chatting,
  },
  setup() {
    const store = useStore();
    const chatting = ref([]);
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const sender = ref('');
    const roomId = ref('');
    const talks = ref([]);
    const input = ref('');
    const disabled = ref(true);
    
    var sock = new SockJS(`${proxy}/ws-stomp`);
    var ws = Stomp.over(sock);
    var reconnect = 0;

    //방 정보 얻기
    const findAllRoom = async () => {
      await axios.get(`${proxy}/chat/rooms`, {
                headers: {
                    Authorization: store.state.accessToken
                }
            })
        .then((res) => {
          sender.value = 'manager';
          roomId.value = res.data[0].roomId;
          console.log(roomId.value);
        });
    }
    
    findAllRoom();

    //메시지 전송
    const sendMessage = async () => {
      if(input.value !== '') {
          let header = {
              'Authorization': store.state.accessToken,
          } 
          ws.send("/pub/chat/message", JSON.stringify({type:'TALK', roomId: roomId.value, sender: sender.value, message: input.value}),header);
          input.value = '';
          setTimeout(() => {
              document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
          }, 300);
      }
    }

    //메시지 수신
    const recvMessage = async (recv) => {
        talks.value.push({"type":recv.type,"sender":(recv.type === 'ENTER'?'[알림]':recv.sender),"message":recv.message, "createdAt":recv.createdAt})
        setTimeout(() => {
            document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
        }, 300);
    }
    
    //연결
    const connect = async () => {
        let header = {
            'Authorization': store.state.accessToken,
        } 
        // pub/sub event
        ws.connect({ Authorization: store.state.accessToken,}, function(frame) {
            ws.subscribe("/sub/chat/room/" + roomId.value, function(input) {
                var recv = JSON.parse(input.body);
                recvMessage(recv);
            });
            ws.send("/pub/chat/message", JSON.stringify({type: "ENTER",roomId: roomId.value, sender: sender.value, message:"채팅방에 입장하였습니다."}), header);
            setTimeout(() => {
                document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
            }, 300);
            disabled.value = false;
        }, function(error) {
            if(reconnect++ <= 5) {
                setTimeout(function() {
                    sock = new SockJS("/ws-stomp");
                    ws = Stomp.over(sock);
                    connect();
                },10*1000);
            }
        });
    }

    //연결
    connect();

    return {
      ws,
      chatting,
      findAllRoom,
      close,
      sendMessage,
      recvMessage,
      connect,
      input,
      talks,
      disabled,
    }
  } 
};
</script>

<style scoped>
.submit {
    padding: 0.4em;border: none;box-shadow: 0 0 5px 0 gray;border-radius: 1em;background-color: white;cursor: pointer;
    margin-left: 5px;
    color:black;
}
.submit:hover {
    background-color: black;
    color: white;
}
.send {
    width: auto;
    max-width: 60%;
    padding: 0.3em;
    background-color: yellow;
    box-shadow: 0 0 5px 0 gray;
    border-radius: 0.3em;
    border: none;
    color: black;
    overflow: visible;
    margin-left: auto;
}
.receive {
    width: auto;
    max-width: 60%;
    padding: 0.3em;
    background-color: #EDEDED;
    box-shadow: 0 0 5px 0 gray;
    border-radius: 0.3em;
    border: none;
    color: black;
    overflow: visible;
    margin-right: auto;
}
.alert {
    width: auto;
    max-width: 60%;
    padding: 0.3em;
    border: none;
    color: black;
    overflow: visible;
    margin: 0 auto;
    white-space: nowrap;
}
.left {
    margin-left: auto;
}
#loading {
    position: fixed;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: black;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
    z-index: 1000;
}
@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>
