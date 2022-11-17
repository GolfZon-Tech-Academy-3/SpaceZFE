import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import SignUp from '../pages/signup.vue';
import Main from '../pages/main.vue';
import Guide from '../pages/guide.vue';
import FindPlace from '../pages/findPlace.vue';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition){
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/main',
            name: 'Main',
            component: Main,
        },
        {
            path: '/registerPlace',
            name: 'RegisterPlace',
            component: Home,
        },
        {
            path: '/findplace',
            name: 'FindPlace',
            component: FindPlace,
        },
        {
            path: '/manage/manager',
            name: 'ManagePlaceManager',
            component: Home,
        },
        {
            path: '/manage/master',
            name: 'ManagePlaceMaster',
            component: Home,
        },
        {
            path: '/mypage',
            name: 'MyPage',
            component: Home,
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: SignUp,
        },
        {
            path: '/guide',
            name: 'Guide',
            component: Guide,
        }
    ]
});

export default router;