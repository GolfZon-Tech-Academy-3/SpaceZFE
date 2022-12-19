<template>
    <div class="wrapper">
        <div class="modal-dialog">
            <div style="width: 100%;height: 48px;background-color: #EDEDED;border-top-left-radius: 1em;border-top-right-radius: 1em;font-weight: 500;text-align: center;line-height: 48px;box-shadow: 0 0 5px 0 gray;">
                {{room.name}}
            </div>
            <div style="width: 100%;height: calc(100% - 48px);overflow-x: hidden;overflow-y: auto;">
                <ul class="list-group">
                    <li class="list-group-item" v-for="message in messages" v-bind:key="message">
                        {{message.sender}} - {{message.message}}
                    </li>
                </ul>
            </div>
            <div style="width: 100%;height: 48px;line-height: 48px;background-color: #EDEDED;border-bottom-left-radius: 1em;border-bottom-right-radius: 1em;box-shadow: 0 0 5px 0 gray;">
                <input style="padding: 0.5em;border-radius: 1em;border:1px solid black;width: calc(100% - 100px);" type="text" placeholder="메시지를 입력하세요" v-model="message" @keyup.enter="sendMessage">
                <button class="submit" type="button" @click="sendMessage">전송</button>
            </div>
        </div>
    </div>

  </template>
  
<script>
  import { ref } from 'vue';
  import axios from '@/axios';
  import { useStore } from 'vuex';
  import Stomp from 'webstomp-client'
  import SockJS from 'sockjs-client'
  
  export default {
    props: {
        sender: {
            type: String,
            required: true,
        },
        roomId: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const store = useStore();
        const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
        const sender = ref(props.sender);
        const roomId = ref(props.roomId);
  
        var sock = new SockJS(`${proxy}/ws-stomp`);
        var ws = Stomp.over(sock);
        // ws.connect
        var reconnect = 0;
        //   const roomId = ref('');
        const room = ref({});
        //   const sender = ref('');
        const message = ref('');
        const messages = ref([]);
        
        // roomId.value = localStorage.getItem('wschat.roomId');
        // sender.value = localStorage.getItem('wschat.sender');
        
        const findRoom = async () => {
    
            await axios.get(`${proxy}/chat/room/${roomId.value}`,{
                headers: {
                    Authorization: store.state.accessToken,
                }
            })
            .then(response => { room.value = response.data; });
            
        }
        findRoom();
    
        const sendMessage = async () => {
            let header = {
                'Authorization': store.state.accessToken,
            } 
            ws.send("/pub/chat/message", JSON.stringify({type:'TALK', roomId:roomId.value, sender:sender.value, message:message.value}),header);
            message.value = '';
        }
        const recvMessage = async (recv) => {
            messages.value.unshift({"type":recv.type,"sender":(recv.type === 'ENTER'?'[알림]':recv.sender),"message":recv.message})
        }
        
        
        const connect = async () => {
            let header = {
                'Authorization': store.state.accessToken,
            } 
            // pub/sub event
            ws.connect({ Authorization: store.state.accessToken,}, function(frame) {

                ws.subscribe("/sub/chat/room/" + roomId.value, function(message) {
                    var recv = JSON.parse(message.body);
                    console.log(recv);
                    recvMessage(recv);
                });
                ws.send("/pub/chat/message", JSON.stringify({type: "ENTER",roomId: roomId.value,sender: sender.value,message:"Master 님이 입장하였습니다."}), header);
            
            }, function(error) {
                if(reconnect++ <= 5) {
                    setTimeout(function() {
                        console.log("connection reconnect");
                        sock = new SockJS("/ws-stomp");
                        ws = Stomp.over(sock);
                        connect();
                    },10*1000);
                }
            });
        }
        
        connect();
        
        return {
            ws,
            reconnect,
            roomId,
            room,
            sender,
            message,
            messages,
            findRoom,
            sendMessage,
            recvMessage,
            connect,
        }
    } 
  };
  </script>
  
<style scoped>
.wrapper {
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
    width: 100%;
    max-width: 350px;
    height: calc(100vh - 3.75em - 60px);
    max-height: 650px;
    margin: 0 auto;
    border-radius: 1em;
    box-shadow: 0 0 5px 0 gray;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.submit {
    padding: 0.4em;border: 1px solid black;border-radius: 1em;background-color: white;cursor: pointer;
    margin-left: 5px;
}
.submit:hover {
    background-color: black;
    color: white;
}
</style>
  