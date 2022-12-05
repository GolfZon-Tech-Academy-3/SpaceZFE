import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home.vue";
import SignUp from "../pages/signup.vue";
import Main from "../pages/main.vue";
import Guide from "../pages/guide.vue";
import FindPlace from "../pages/findPlace.vue";
import ReservationStatus from "../pages/backOffice/reservationStatus.vue";
import ManagePlace from "../pages/backOffice/managePlace.vue";
import Qna from "../pages/backOffice/qna.vue";
import MasterCompany from "../pages/master/company.vue";
import MasterAccount from "../pages/master/account.vue";
import RegisterCompany from "../pages/registerCompany.vue";
import PlaceDetail from "../pages/placeDetail/_id.vue";
import Reservation from "../pages/Reservation/_id.vue";
import MyPage from "../pages/myPage.vue";

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
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/guide",
      name: "Guide",
      component: Guide,
    },
    {
      path: "/backoffice/reservationstatus",
      name: "ReservationStatus",
      component: ReservationStatus,
    },
    {
      path: "/backoffice/manageplace",
      name: "ManagePlace",
      component: ManagePlace,
    },
    {
      path: "/backoffice/qna",
      name: "Qna",
      component: Qna,
    },
    {
      path: "/master/company",
      name: "MasterCompany",
      component: MasterCompany,
    },
    {
      path: "/master/account",
      name: "MasterAccount",
      component: MasterAccount,
    },
    {
      path: "/registercompany",
      name: "RegisterCompany",
      component: RegisterCompany,
    },
    {
      path: "/placedetail",
      name: "PlaceDetail",
      component: PlaceDetail,
    },
    {
      path: "/reservation",
      name: "Reservation",
      component: Reservation,
    },
  ],
});

export default router;
