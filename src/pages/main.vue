<template>
    <div>
        <div class="popular">
            <div class="inner">
                <div class="title">
                    <span>인기장소</span>
                    <span class="hot">HOT</span>
                    <button class="button">></button>
                    <button class="button">&lt</button>
                </div>
                <div class="places">
                    <!-- v-for 로 짜야함 -->
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="guide">
            <div class="box40" >
                <router-link class="hostingGuide" :to="{name:'Guide'}">
                    <div style="color:white; font-size:3vh; font-weight:bold; padding-left: 3%;margin-top: 3.4%;">
                        장소 등록, 시작해볼까요?
                        <img style="float:right; width:7%;margin-right:3%;" src="../assets/reg.png" />
                    </div>
                    <div style="color:white; font-weight:bold; padding-left: 3%;">
                        호스팅 가이드 보기
                    </div>
                </router-link>
            </div>
            <div class="box40">
                <div class="views">
                    <div class="view1">
                        <div style="margin:5% 5%; font-size:2vw; font-weight: bold; color:#041461;">
                            OFFICE
                        </div>
                    </div>
                    <div class="view2">
                        <div style="margin:5% 5%; font-size:2vw; font-weight: bold;">
                            MEETING ROOM
                        </div>
                    </div>
                    <div class="view3">
                        <div style="margin:5% 5%; font-size:2vw; font-weight: bold; color:white;">
                            DESK
                        </div>
                    </div>
                </div>
            </div>
            <div class="box20" @click="moveToAll">
                <router-link class="findPlace" :to="{name:'FindPlace'}">
                    전체 보기
                </router-link>
            </div>
        </div>

        <div class="new">
            <div class="inner">
                <div class="title">
                    <span>새로 등록된 장소</span>
                    <span class="newP">NEW</span>
                </div>
                <div class="places2">
                    <!-- v-for 로 짜야함 -->
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                    <div class="place">
                        
                    </div>
                </div>
                <div class="box20">
                    <div class="findPlace">
                        <div>
                            새로 등록된 장소 더보기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const moveToAll = () => {
            store.dispatch('updatePage', 1);
            store.dispatch('updateType', 'all');
            store.dispatch('updateDate', '');
            store.dispatch('updateTime', '');
            store.dispatch('updateWord', '');
            router.push({
                name: 'FindPlace',
            })
        }

        return {
            moveToAll,
        }
    }
}
</script>

<style scoped>
.popular {
    width: 100%;
    min-width: 1000px;
    height: 40vw;
    min-height: 400px;
    background-color: #F0F3F5;
    display : flex;
    justify-content: center;
    align-items : center;
}
.inner {
    width: 90%;
    height: 80%;
}
.title {
    width: 100%;
    height:10%;
    color: #041461;
    float: left;
    font-size: 1.5em;
    font-weight: bold;
}
.hot {
    margin-left: 1em;
    font-size: 0.5em;
    font-weight: lighter;
    color: #FF5252;
    background-color: white;
    padding: 0.3vw 1.2vw;
    border: 1px #FF5252 solid;
    border-radius: 2vw;
}
.places {
    width: 100%;
    height : 80%;
}
.button {
    width: 2.5vw;
    height: 2.5vw;
    font-size: 1.5vw;
    float: right;
    border-radius: 50%;
    border:none;
    background-color: white;
    cursor: pointer;
}
.button:hover {
    background-color:grey;
}
.place {
    width: 25%;
    height : 100%;
    float: left;
}
.guide {
    width: 100%;
    min-width: 1000px;
    height: 40vw;
    min-height: 400px;
    background-color: white;
}
.box40 {
    width: 100%;
    height: 40%;
    display : flex;
    justify-content: center;
    align-items : center;
}
.box20 {
    width: 100%;
    height: 20%;
    display : flex;
    justify-content: center;
    align-items : center;
}
.hostingGuide {
    width: 80%;
    height: 60%;
    background-color: #041461;
    border-radius: 1em;
    cursor: pointer;
    text-decoration: none;
}
.views {
    width: 70%;
    height: 50%;
    display: flex;
}
.view1 {
    width: 30.3%;
    height: 100%;
    margin: 0% 1.5%;
    background-color: grey;
    border-radius: 1vw;
    cursor: pointer;
    background-image: url("../assets/office.png");
    background-size:contain;
}
.view2 {
    width: 30.3%;
    height: 100%;
    margin: 0% 1.5%;
    background-color: grey;
    border-radius: 1vw;
    cursor: pointer;
    background-image: url("../assets/meeting.png");
    background-size:contain;
}
.view3 {
    width: 30.3%;
    height: 100%;
    margin: 0% 1.5%;
    background-color: grey;
    border-radius: 1vw;
    cursor: pointer;
    background-image: url("../assets/desk.png");
    background-size:contain;
}
.findPlace {
    width: 30%;
    height: 60%;
    font-size: 2vw;
    font-weight: bold;
    color: grey;
    background-color: #EDEDED;
    border-radius: 1vw;
    display : flex;
    justify-content: center;
    align-items : center;
    cursor: pointer;
    text-decoration: none;
}
.findPlace:hover {
    background-color:black;
}
.new {
    width: 100%;
    min-width: 1000px;
    height: 40vw;
    min-height: 400px;
    background-color: white;
    display : flex;
    justify-content: center;
    align-items : center;
}
.newP {
    margin-left: 1em;
    font-size: 0.5em;
    font-weight: lighter;
    color: #5271FF;
    background-color: white;
    padding: 0.3vw 1.2vw;
    border: 1px #5271FF solid;
    border-radius: 2vw;
}
.places2 {
    width: 100%;
    height : 70%;
}
</style>