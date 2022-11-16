import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import SignUp from '../pages/signup.vue';
import Main from '../pages/main.vue';
import Guide from '../pages/guide.vue';

const router = createRouter({
    history: createWebHistory(),
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