AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
const AppHomeHome = {
    template: `
        <div>
            <div id="home__logo">
                <img src="../images/logo.png">
            </div>
            <div id="home__stat">
                <div id="home__stat__circle">
                    <svg id="home__stat__circle__ring">
                        <circle id="home__stat__circle__ring__total" cx="50%" cy="50%" r="50%"></circle>
                        <circle id="home__stat__circle__ring__my" cx="50%" cy="50%" r="50%"></circle>
                    </svg>
                    <img id="home__stat__circle__tree" src="../images/tree.png">
                </div>
            </div>
            <div id="home__card">
                <p id="home__card__score">
                    <span id="home__card__score__my">101</span>
                    <span id="home__card__score__total">/ 120</span>
                </p>
                <p id="home__card__info">My Usage</p>
                <div class="home__card__item" @click="router.push('/home/electric');">
                    <div class="home__card__item__icon">
                        <i class="fas fa-bolt"></i>
                    </div>
                    <div class="home__card__item__info">
                        <p class="home__card__item__info__category">Southern California Edison</p>
                        <p class="home__card__item__info__amount">3.14 kWh</p>
                    </div>
                    <div class="home__card__item__score">
                        <span class="home__card__item__score__my">32</span>
                        <span class="home__card__item__score__total"> / 40</span>
                    </div>
                </div>
                <div class="home__card__item" @click="router.push('/home/gas');">
                    <div class="home__card__item__icon">
                        <i class="fas fa-fire"></i>
                    </div>
                    <div class="home__card__item__info">
                        <p class="home__card__item__info__category">Southern California Gas</p>
                        <p class="home__card__item__info__amount">3.14 Ccf</p>
                    </div>
                    <div class="home__card__item__score">
                        <span class="home__card__item__score__my">40</span>
                        <span class="home__card__item__score__total"> / 40</span>
                    </div>
                </div>
                <div class="home__card__item" @click="router.push('/home/water');">
                    <div class="home__card__item__icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="home__card__item__info">
                        <p class="home__card__item__info__category">Irvine Ranch Water District</p>
                        <p class="home__card__item__info__amount">3.14 gal</p>
                    </div>
                    <div class="home__card__item__score">
                        <span class="home__card__item__score__my">29</span>
                        <span class="home__card__item__score__total"> / 40</span>
                    </div>
                </div>
            </div>
        </div>
    `
};
const AppHomeElectric = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Energy Usage</span>
                </div>
                <div class="titlebar__left" @click="router.push('/home');">
                    <i class="fas fa-angle-left">
                </div>
            </div>
            <div class="content">
                <div class="home__utility__datebar">
                    <span :class="currentView === 0 ? 'active' : ''" @click="currentView = 0;">D</span><span :class="currentView === 1 ? 'active' : ''" @click="currentView = 1;">W</span><span :class="currentView === 2 ? 'active' : ''" @click="currentView = 2;">M</span><span :class="currentView === 3 ? 'active' : ''" @click="currentView = 3;">Y</span>
                </div>
                <div class="home__utility__graph">
                    <p>Graph will be here.</p>
                    <p>Current 13.4 kWh Est. Cost $3.80</p>
                </div>
                <hr class="home__utility__divider">
                <div class="home__utility__bar">
                    <p> Bar will go here</p>
                </div>
                <div class="home__utility__info">
                    <div>
                        <p>EcoLimit</p>
                        <p>You have exceeded your daily usage of 9 kWh</p>
                    </div>
                    <div>
                        <p>EcoScore</p>
                        <span>32</span>
                        <span> / 40</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            currentView: 0
        };
    }
};
const AppHomeGas = {
    template: `
        <h1>This is gas.</h1>
    `
};
const AppHomeWater = {
    template: `
        <h1>This is water.</h1>
    `
};
const AppHome = {
    template: `
        <router-view></router-view>
    `
};
const AppSocial = {
    template: `
        <h1>This is social.</h1>
    `
};
const AppTips = {
    template: `
        <h1>This is tips.</h1>
    `
};
const AppProfile = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Profile</span>
                </div>
                <div class="titlebar__left" @click="router.push('/home');">
                    <i class="fas fa-angle-left">
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            firstName: AV.User.current().get('firstName'),
            lastName: AV.User.current().get('lastName'),
            followers: [],
            followees: []
        };
    },
    created: function () {
        
    }
};
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/home',
            component: AppHome,
            children: [
                {
                    path: '',
                    component: AppHomeHome
                },
                {
                    path: 'electric',
                    component: AppHomeElectric
                },
                {
                    path: 'gas',
                    component: AppHomeGas
                },
                {
                    path: 'water',
                    component: AppHomeWater
                }
            ]
        },
        {
            path: '/social',
            component: AppSocial
        },
        {
            path: '/tips',
            component: AppTips
        },
        {
            path: '/profile',
            component: AppProfile
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
                        <div id="current-app-wrapper">
                            <router-view></router-view>
                        </div>
                        <nav>
                            <ul>
                                <li v-for="app in apps" :class="[$route.path.startsWith(app.path) ? 'active' : '']" @click="router.push(app.path);">
                                    <img :src="'../images/' + app.icon">
                                    <span>{{ app.name }}</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                `,
                data: function () {
                    return {
                        apps: [
                            {
                                icon: 'home-icon.png',
                                name: 'Home',
                                path: '/home'
                            },
                            {
                                icon: 'world-icon.png',
                                name: 'Social',
                                path: '/social'
                            },
                            {
                                icon: 'bulb-icon.png',
                                name: 'Tips',
                                path: '/tips'
                            },
                            {
                                icon: 'person-icon.png',
                                name: 'Profile',
                                path: '/profile'
                            }
                        ]
                    };
                },
                router
            });
        });
    }
    else {
        location.href = '/auth';
    }
});