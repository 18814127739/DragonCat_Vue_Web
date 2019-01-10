import Vue from 'vue'
import VueRouter from 'vue-router'

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
})

export default router