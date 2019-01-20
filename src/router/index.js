import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie';
import { Message } from 'element-ui';

const Home = () => import('@pages/Home/Home')
const Poem = () => import('@pages/Poem/Poem')
const EditPoem = () => import('@pages/Poem/EditPoem')
const Personal = () => import('@pages/Personal/Personal')
const EditProjectExp = () => import('@pages/Personal/EditProjectExp')
const EditAwards = () => import('@pages/Personal/EditAwards')
const PhotoWall = () => import('@pages/PhotoWall/PhotoWall')
const PhotoWallManage = () => import('@pages/PhotoWall/Manage')
const ITNote = () => import('@pages/ITNote/ITNote')
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
    component: Personal,
  }, {
    name: 'edit-project-exp',
    path: '/edit-project-exp',
    component: EditProjectExp,
  }, {
    name: 'edit-awards',
    path: '/edit-awards',
    component: EditAwards,

  }, {
    name: 'IT-note',
    path: '/IT-note',
    component: ITNote,
  }, {
    name: 'photo-wall',
    path: '/photo-wall',
    component: PhotoWall,
  }, {
    name: 'photo-wall-manage',
    path: '/photo-wall-manage',
    component: PhotoWallManage,
  }
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
  // mode: 'history',
  base: __dirname,
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (['login'].includes(to.name)) {
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
      query: { redirect: to.fullPath }
    })
  }
});

export default router