import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router'

Vue.use(Router);
import Login from './components/Login'
import Chat from './components/Chat'

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            component: App,
            children: [
                {
                    path: '',
                    redirect: Login
                },
                {
                    path: '/login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: '/chat',
                    name: 'Chat',
                    component: Chat
                }
            ]
        }

    ]
});


import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

Vue.config.productionTip = false;

// new Vue({
//     el: '#app',
//     router,
//     components: {App},
//     template: '<App/>'
// });

new Vue({
    render: h => h(App),
    router
}).$mount('#app');
