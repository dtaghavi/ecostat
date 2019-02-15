AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
const AppHome = {
    template: `
        <section>
            <img id="home__logo" src="../images/logo.png">
            <img id="home__tree" src="../images/tree.png">
            <p @click="AV.User.logOut(); location.href='/auth';">Click here to log out.</p>
        </section>
    `
};
const AppSocial = {
    template: `
        <h1>This is social.</h1>
    `
};
const AppCalendar = {
    template: `
        <h1>This is calendar.</h1>
    `
};
const AppTips = {
    template: `
        <h1>This is tips.</h1>
    `
};
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/home',
            component: AppHome
        },
        {
            path: '/social',
            component: AppSocial
        },
        {
            path: '/calendar',
            component: AppCalendar
        },
        {
            path: '/tips',
            component: AppTips
        }
    ]
});
Promise.resolve(AV.User.current()).then(user => user ? user.isAuthenticated().then(authenticated => authenticated ? user : null) : null).then(user => {
    if (user) {
        AV.User.current().fetch().then(function () {
            new Vue({
                el: '#main',
                template: `
                    <div>
                        <nav>
                            <ul id="app-list">
                                <li v-for="app in apps" :class="[$route.path.startsWith(app.path) ? 'active' : '']" @click="router.push(app.path);">
                                    <p><i :class="['fas', app.icon]"></i></p>
                                    <p><span>{{ app.name }}</span></p>
                                </li>
                            </ul>
                        </nav>
                        <div id="current-app-wrapper">
                            <router-view></router-view>
                        </div>
                    </div>
                `,
                data: function () {
                    return {
                        apps: [
                            {
                                icon: 'fa-home',
                                name: 'Home',
                                path: '/home'
                            },
                            {
                                icon: 'fa-globe-americas',
                                name: 'Social',
                                path: '/social'
                            },
                            {
                                icon: 'fa-calendar-alt',
                                name: 'Calendar',
                                path: '/calendar'
                            },
                            {
                                icon: 'fa-heart',
                                name: 'Tips',
                                path: '/tips'
                            }
                        ]
                    };
                },
                computed: {

                },
                created: function () {
                    let vm = this;

                },
                router
            });
        });
    }
    else {
        location.href = '/auth';
    }
});