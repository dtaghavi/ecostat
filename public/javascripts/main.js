AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
const AppHomeHome = {
    template: `
        <div>
            <div id="home__stat">
                <div id="home__stat__logo">
                    <img src="../images/logo.png">
                </div>
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
                <hr>
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
const AppProfileHome = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Profile</span>
                </div>
                <div class="titlebar__right" @click="router.push('/profile/settings');">
                    <i class="fas fa-cog"></i>
                </div>
            </div>
            <div class="content">
                <div id="profile__header">
                    <div id="profile__header__image">
                        <img :src="profilePicture ? profilePicture.url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" @click="document.getElementById('profile-picture').click();">
                        <input type="file" id="profile-picture" style="display: none;" @change="uploadProfilePicture()">
                    </div>
                    <div id="profile__header__info">
                        <p id="profile__header__name">{{firstName}} {{lastName}}</p>
                        <p id="profile__header__tier">EcoTier: {{ecoTier}}</p>
                        <p id="profile__header__social"><span>{{followers.length}} Followers</span><span>{{followees.length}} Following</span></p>
                    </div>
                </div>
                <hr>
                <div id="profile__achievements">
                    <div v-for="achievement in achievements">
                        <div class="profile__achievement">
                            <div class="profile__achievement__info">
                                <p class="profile__achievement__info__text">Achieved a new {{achievement.get('content').type}}!</p>
                                <p v-if="achievement.get('content').type === 'EcoStatus'" class="profile__achievement__info__text">Tier: {{achievement.get('content').tier}}</p>
                                <p v-if="achievement.get('content').type === 'Streak'" class="profile__achievement__info__text">Days: {{achievement.get('content').days}}</p>
                                <p @click="like(achievement)" class="profile__achievement__info__text"><i class="far fa-heart"></i> {{achievement.get('likedBy').length}}</p>
                            </div>
                            <div class="profile__achievement__icon">
                            </div>
                        </div>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            profilePicture: AV.User.current().get('profilePicture'),
            ecoTier: AV.User.current().get('ecoTier'),
            firstName: AV.User.current().get('firstName'),
            lastName: AV.User.current().get('lastName'),
            followers: [],
            followees: [],
            achievements: []
        };
    },
    created: function () {
        let vm = this;
        var ahievementQuery = new AV.Query('Achievement');
        ahievementQuery.equalTo('user', AV.User.current());
        ahievementQuery.descending('createdAt');
        ahievementQuery.find().then(function (results) {
            vm.achievements = results;
        });
        var followeeQuery = AV.User.current().followeeQuery();
        followeeQuery.include('followee');
        followeeQuery.find().then(function (results) {
            vm.followees = results;
        });
        var followerQuery = AV.User.current().followerQuery();
        followerQuery.include('follower');
        followerQuery.find().then(function (results) {
            vm.followers = results;
        });
    },
    methods: {
        like: function (achievement) {
            var found = false;
            for (var i = 0; i < achievement.get('likedBy').length; i++) {
                if (achievement.get('likedBy')[i].id === AV.User.current().id) {
                    found = true;
                }
            }
            if (found) {
                achievement.remove('likedBy', AV.User.current());
                achievement.save();
            }
            else {
                achievement.addUnique('likedBy', AV.User.current());
                achievement.save();
            }
        },
        uploadProfilePicture: function () {
            let vm = this;
            var file = new AV.File(name, document.getElementById('profile-picture').files[0]);
            file.save().then(function (file) {
                AV.User.current().set('profilePicture', file);
                AV.User.current().save().then(function () {
                    alert('Profile picture uploaded.');
                    vm.profilePicture = AV.User.current().get('profilePicture');
                });
            }, function (error) {
                alert(error);
            });
        }
    }
};
const AppProfileSettings = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Settings</span>
                </div>
                <div class="titlebar__left" @click="router.push('/profile');">
                    <i class="fas fa-angle-left">
                </div>
                <div style="font-size: 12pt; width: unset; right: 12px;" class="titlebar__right">
                    <span @click="saveChanges();">Save</span>
                </div>
            </div>
            <div class="content">
                <p class="settings__subtitle">
                    <span>My info</span>
                </p>
                <div>
                    <div class="settings__item">
                        <span class="settings__item__name">First Name</span>
                        <input class="settings__item__value" v-model="firstName"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Last Name</span>
                        <input class="settings__item__value" v-model="lastName"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Email</span>
                        <input class="settings__item__value" v-model="email"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Phone Number</span>
                        <input class="settings__item__value" v-model="mobilePhoneNumber"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Household Size</span>
                        <input class="settings__item__value" :value="householdSize" @input="householdSize = parseInt($event.target.value);"></input>
                    </div>
                    <hr>
                    <div class="settings__item" @click="logOut();">
                        <span style="color: red; text-transform: uppercase;" class="settings__item__name">Log Out</span>
                    </div>
                </div>
                <p class="settings__subtitle">Privacy</p>
                <div>
                    <div class="settings__item">
                        <span class="settings__item__name">Display EcoStatus</span>
                        <div :class="['settings__item__toggle', displayEcoStatus ? 'settings__item__toggle--on' : '']" @click="displayEcoStatus = !displayEcoStatus;">
                            <div class="settings__item__toggle__circle"></div>
                        </div>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Show Achievements</span>
                        <div :class="['settings__item__toggle', showAchievements ? 'settings__item__toggle--on' : '']" @click="showAchievements = !showAchievements;">
                            <div class="settings__item__toggle__circle"></div>
                        </div>
                    </div>
                    <hr>
                </div>
                <p class="settings__subtitle">Devices</p>
                <div>
                    <div class="settings__item">
                        <span class="settings__item__name">Water Tracker 2.0</span>
                        <input class="settings__item__value" v-model="waterID"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Gas Monitor</span>
                        <input class="settings__item__value" v-model="gasID"></input>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Electricity Monitor</span>
                        <input class="settings__item__value" v-model="electricID"></input>
                    </div>
                    <hr>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            gasID: '',
            waterID: '',
            electricID: '',
            firstName: '',
            lastName: '',
            email: '',
            mobilePhoneNumber: '',
            householdSize: 0,
            displayEcoStatus: false,
            showAchievements: false
        };
    },
    created: function () {
        let vm = this;
        vm.gasID = AV.User.current().get('gasID');
        vm.waterID = AV.User.current().get('waterID');
        vm.electricID = AV.User.current().get('electricID');
        vm.firstName = AV.User.current().get('firstName');
        vm.lastName = AV.User.current().get('lastName');
        vm.email = AV.User.current().get('email');
        vm.mobilePhoneNumber = AV.User.current().get('mobilePhoneNumber');
        vm.householdSize = AV.User.current().get('householdSize');
        vm.displayEcoStatus = AV.User.current().get('displayEcoStatus');
        vm.showAchievements = AV.User.current().get('showAchievements');
    },
    methods: {
        saveChanges: function () {
            let vm = this;
            AV.User.current().set('gasID', vm.gasID);
            AV.User.current().set('waterID', vm.waterID);
            AV.User.current().set('electricID', vm.electricID);
            AV.User.current().set('firstName', vm.firstName);
            AV.User.current().set('lastName', vm.lastName);
            AV.User.current().set('email', vm.email);
            AV.User.current().set('mobilePhoneNumber', vm.mobilePhoneNumber);
            AV.User.current().set('householdSize', vm.householdSize);
            AV.User.current().set('displayEcoStatus', vm.displayEcoStatus);
            AV.User.current().set('showAchievements', vm.showAchievements);
            AV.User.current().save().then(function () {
                alert('Profile saved.');
            }, function (error) {
                alert(error);
            });
        },
        logOut: function () {
            AV.User.logOut().then(function () {
                location.href = '/';
            });
        }
    }
};
const AppProfile = {
    template: `
        <router-view></router-view>
    `
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
            component: AppProfile,
            children: [
                {
                    path: '',
                    component: AppProfileHome
                },
                {
                    path: 'settings',
                    component: AppProfileSettings
                },
            ]
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