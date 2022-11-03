import {createRouter , createWebHashHistory} from 'vue-router'

import Login from "./components/Login.vue"
import Room from "./components/Room.vue"

const router = createRouter({
    history:createWebHashHistory(),

    routes:[
        {path:'/', redirect:'/login'},
        {path:'/login', component: Login},
        {path:'/room', component : Room},
    ]
})

export default router