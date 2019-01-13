import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie';
import { Message } from 'element-ui';
// import store from '../store';

const Home = () => import('@pages/Home')
const Poem = () => import('@pages/Poem')
const EditPoem = () => import('@pages/EditPoem')
const PersonalPage = () => import('@pages/PersonalPage')
const PhotoWall = () => import('@pages/PhotoWall')
const ITNote = () => import('@pages/ITNote')
const Login = () => import('@pages/Login')

Vue.use(VueRouter);

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
  }, {
    name: 'home',
    path: '/',
    component: Home,
  }, {
    name: 'poems-with-future',
    path: '/poems-with-future',
    component: Poem,
  }, {
    name: 'new-poem',
    path: '/new-poem',
    component: EditPoem,
  }, {
    name: 'edit-poem',
    path: '/edit-poem/:title',
    component: EditPoem,
  }, {
    name: 'personal-page',
    path: '/personal-page',
    component: PersonalPage,
  }, {
    name: 'IT-note',
    path: '/IT-note',
    component: ITNote,
  }, {
    name: 'photo-wall',
    path: '/photo-wall',
    component: PhotoWall,
  },
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
  // mode: 'history',
  base: __dirname,
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (['home', 'login'].includes(to.name)) {
    next();
  } else if (Cookies.get('token')) {
    next();
  } else {
    Message.error('登录已超时，请重新登录');
    redirectLogin();
  }

  function redirectLogin() {
    next({
      path: '/login',
      query: { redirect: to.name }
    })
  }
});

export default router