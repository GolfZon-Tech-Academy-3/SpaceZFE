import store from '../store';
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home.vue";
import SignUp from "../pages/signup.vue";
import Main from "../pages/main.vue";
import Guide from "../pages/guide.vue";
import FindPlace from "../pages/findPlace.vue";
import ManageCompany from "../pages/backOffice/manageCompany.vue";
import ReservationStatus from "../pages/backOffice/reservationStatus.vue";
import ManagePlace from "../pages/backOffice/managePlace.vue";
import Qna from "../pages/backOffice/qna.vue";
import MasterCompany from "../pages/master/company.vue";
import MasterAccount from "../pages/master/account.vue";
import RegisterCompany from "../pages/registerCompany.vue";
import PlaceDetail from "../pages/placeDetail/_id.vue";
import Reservation from "../pages/Reservation/_id.vue";
import MyPage from "../pages/myPage.vue";

const beforeMypage = () => (to, from, next) => {
  if(store.state.authority == null) {
    alert('로그인이 필요합니다');
    next('/');
    return;
  } else if (store.state.authority === 'member') {
    next();
    return;
  } else if (store.state.authority === 'manager') {
    next();
    return;
  } else if (store.state.authority === 'master') {
    alert('접근 권한이 없습니다');
  }
}

const beforeRegisterCompany = () => (to, from, next) => {
  if(store.state.authority == null) {
    alert('로그인이 필요합니다');
    return;
  } else if (store.state.authority === 'member') {
    next();
    return;
  } else if (store.state.authority === 'manager') {
    alert('이미 매니저입니다');
    return;
  } else if (store.state.authority === 'master') {
    alert('접근할 수 없습니다');
  }
};

const beforeSignup = () => (to, from, next) => {
  if(store.state.authority == null) {
    next();
    return;
  } else {
    alert('로그아웃이 필요합니다');
  }
};

const beforeBackoffice = () => (to, from, next) => {
  if(store.state.authority === 'manager') {
    next();
  } else {
    alert('접근 권한이 없습니다');
  }
};

const beforeMaster = () => (to, from, next) => {
  if(store.state.authority === 'master') {
    next();
  } else {
    alert('접근 권한이 없습니다');
  }
};

const exceptMaster = () => (to, from, next) => {
  if(store.state.authority === 'master') {
    alert('접근 권한이 없습니다');
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/main",
      name: "Main",
      component: Main,
    },
    {
      path: "/findplace",
      name: "FindPlace",
      component: FindPlace,
    },
    {
      path: "/mypage",
      name: "MyPage",
      component: MyPage,
      beforeEnter: beforeMypage(),
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
      beforeEnter: beforeSignup(),
    },
    {
      path: "/guide",
      name: "Guide",
      component: Guide,
    },
    {
      path: "/backoffice/managecompany",
      name: "ManageCompany",
      component: ManageCompany,
      beforeEnter: beforeBackoffice(),
    },
    {
      path: "/backoffice/reservationstatus",
      name: "ReservationStatus",
      component: ReservationStatus,
      beforeEnter: beforeBackoffice(),
    },
    {
      path: "/backoffice/manageplace",
      name: "ManagePlace",
      component: ManagePlace,
      beforeEnter: beforeBackoffice(),
    },
    {
      path: "/backoffice/qna",
      name: "Qna",
      component: Qna,
      beforeEnter: beforeBackoffice(),
    },
    {
      path: "/master/company",
      name: "MasterCompany",
      component: MasterCompany,
      beforeEnter: beforeMaster(),
    },
    {
      path: "/master/account",
      name: "MasterAccount",
      component: MasterAccount,
      beforeEnter: beforeMaster(),
    },
    {
      path: "/registercompany",
      name: "RegisterCompany",
      component: RegisterCompany,
      beforeEnter: beforeRegisterCompany(),
    },
    {
      path: "/placedetail",
      name: "PlaceDetail",
      component: PlaceDetail,
      beforeEnter: exceptMaster(),
    },
    {
      path: "/reservation",
      name: "Reservation",
      component: Reservation,
      beforeEnter: exceptMaster(),
    },
  ],
});

export default router;
