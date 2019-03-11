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
                <div class="home__card__item" @click="router.push('/home/electricity');">
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
const AppHomeElectricity = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Energy Usage</span>
                </div>
                <div class="titlebar__left" @click="router.back();">
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
const AppSocialHome = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Friends' Eco Accomplishments</span>
                </div>
            </div>
            <div class="content">
                <div id="social__searchbar">
                    <div id="social__searchbar__contents">
                        <div id="social__searchbar__main" :class="[keyword ? 'short' : '']">
                            <i class="fas fa-search"></i>
                            <input placeholder="Search" v-model="keyword">
                        </div>
                        <span id="social__searchbar__search" @click="router.push('/social/results/' + keyword);">Search</span>
                    </div>
                </div>
                <hr>
                <div>
                    <div v-for="achievement in achievements">
                        <div v-if="achievement.get('user').get('showAchievements')">
                            <div class="profile__achievement">
                                <div class="profile__achievement__image" @click="router.push('/user/' + achievement.get('user').id);">
                                    <img :src="achievement.get('user').get('profilePicture') ? achievement.get('user').get('profilePicture').url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'">
                                </div>
                                <div class="profile__achievement__info">
                                    <p style="color: #49a187;" class="profile__achievement__info__text" @click="router.push('/user/' + achievement.get('user').id);">{{ achievement.get('user').get('firstName') }} {{ achievement.get('user').get('lastName') }}</p>
                                    <p class="profile__achievement__info__text">Achieved a new {{ achievement.get('content').type }}!</p>
                                    <p v-if="achievement.get('content').type === 'EcoStatus'" class="profile__achievement__info__text">Tier: {{ achievement.get('content').tier }}</p>
                                    <p v-if="achievement.get('content').type === 'Streak'" class="profile__achievement__info__text">Days: {{ achievement.get('content').days }}</p>
                                    <p @click="like(achievement);" class="profile__achievement__info__text"><i class="far fa-heart"></i> {{ achievement.get('likedBy').length }}</p>
                                </div>
                                <div class="profile__achievement__icon">
                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            keyword: '',
            achievements: []
        };
    },
    created: function () {
        let vm = this;
        let followeeQuery = AV.User.current().followeeQuery();
        followeeQuery.find().then(function (followees) {
            let achievementQuery = new AV.Query('Achievement');
            achievementQuery.include('user');
            achievementQuery.containedIn('user', followees);
            achievementQuery.descending('createdAt');
            achievementQuery.find().then(function (achievements) {
                vm.achievements = achievements;
            });
        });
    },
    methods: {
        like: function (achievement) {
            let found = false;
            for (let i = 0; i < achievement.get('likedBy').length; i++) {
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
        }
    }
};
const AppSocialResults = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Search Results</span>
                </div>
                <div class="titlebar__left" @click="router.back();">
                    <i class="fas fa-angle-left">
                </div>
            </div>
            <div class="content">
                <div>
                    <div v-for="user in users">
                        <div class="social__result" @click="router.push('/user/' + user.id);">
                            <div class="social__result__image">
                                <img :src="user.get('profilePicture') ? user.get('profilePicture').url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'">
                            </div>
                            <div class="social__result__info">
                                <p class="socia__result__name">{{ user.get('firstName') }} {{ user.get('lastName') }}</p>
                                <p class="social__result__tier">EcoTier: {{ user.get('ecoTier') }}</p>
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
            users: []
        };
    },
    created: function () {
        let vm = this;
        let keywords = vm.$route.params.keyword.trim().split(' ');
        if (keywords[0] && keywords.length === 1) {
            let firstNameQuery = new AV.Query('_User');
            firstNameQuery.startsWith('firstName', keywords[0]);
            let lastNameQuery = new AV.Query('_User');
            lastNameQuery.startsWith('lastName', keywords[0]);
            let userQuery = AV.Query.or(firstNameQuery, lastNameQuery);
            userQuery.find().then(function (users) {
                vm.users = users;
            });
        }
        else if (keywords.length >= 2) {
            let userQuery = new AV.Query('_User');
            userQuery.startsWith('firstName', keywords[0]);
            userQuery.startsWith('lastName', keywords[1]);
            userQuery.find().then(function (users) {
                vm.users = users;
            });
        }
    }
};
const AppUser = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>{{ firstName }}'s Profile</span>
                </div>
                <div class="titlebar__left" @click="router.back();">
                    <i class="fas fa-angle-left">
                </div>
                <div v-if="$route.params.id !== AV.User.current().id" class="titlebar__right" @click="follow();">
                    <i :class="['fas', following ? 'fa-user-minus' : 'fa-user-plus' ]"></i>
                </div>
            </div>
            <div class="content">
                <div class="profile__header">
                    <div class="profile__header__image">
                        <img :src="profilePicture ? profilePicture.url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'">
                    </div>
                    <div class="profile__header__info">
                        <p class="profile__header__name">{{ firstName }} {{ lastName }}</p>
                        <p v-if="displayEcoStatus" class="profile__header__tier">EcoTier: {{ ecoTier }}</p>
                        <p class="profile__header__social"><span>{{ followers.length }} Followers</span><span>{{ followees.length }} Following</span></p>
                    </div>
                </div>
                <hr>
                <div v-if="showAchievements">
                    <div v-for="achievement in achievements">
                        <div class="profile__achievement" style="height: 96px;">
                            <div class="profile__achievement__info" style="left: 16px;">
                                <p class="profile__achievement__info__text">Achieved a new {{ achievement.get('content').type }}!</p>
                                <p v-if="achievement.get('content').type === 'EcoStatus'" class="profile__achievement__info__text">Tier: {{ achievement.get('content').tier }}</p>
                                <p v-if="achievement.get('content').type === 'Streak'" class="profile__achievement__info__text">Days: {{ achievement.get('content').days }}</p>
                                <p @click="like(achievement);" class="profile__achievement__info__text"><i class="far fa-heart"></i> {{ achievement.get('likedBy').length }}</p>
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
            displayEcoStatus: false,
            showAchievements: false,
            profilePicture: new AV.File(),
            ecoTier: '',
            firstName: '',
            lastName: '',
            followers: [],
            followees: [],
            achievements: [],
            following: false
        };
    },
    created: function () {
        let vm = this;
        new AV.Query('_User').get(vm.$route.params.id).then(function (user) {
            vm.displayEcoStatus = user.get('displayEcoStatus');
            vm.showAchievements = user.get('showAchievements');
            vm.profilePicture = user.get('profilePicture');
            vm.ecoTier = user.get('ecoTier');
            vm.firstName = user.get('firstName');
            vm.lastName = user.get('lastName');
            let achievementQuery = new AV.Query('Achievement');
            achievementQuery.equalTo('user', user);
            achievementQuery.descending('createdAt');
            achievementQuery.find().then(function (achievements) {
                vm.achievements = achievements;
            });
            let followeeQuery = user.followeeQuery();
            followeeQuery.include('followee');
            followeeQuery.find().then(function (followees) {
                vm.followees = followees;
            });
            let followerQuery = user.followerQuery();
            followerQuery.include('follower');
            followerQuery.find().then(function (followers) {
                vm.followers = followers;
                for (let follower of vm.followers) {
                    if (follower.id === AV.User.current().id) {
                        vm.following = true;
                    }
                }
            });
        });
    },
    methods: {
        like: function (achievement) {
            let found = false;
            for (let i = 0; i < achievement.get('likedBy').length; i++) {
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
        follow: function () {
            let vm = this;
            if (vm.following) {
                AV.User.current().unfollow(vm.$route.params.id).then(function () {
                    vm.following = false;
                });
            }
            else {
                AV.User.current().follow(vm.$route.params.id).then(function () {
                    vm.following = true;
                });
            }
        }
    }
};
const AppSocial = {
    template: `
        <router-view></router-view>
    `
};
const AppTipsHome = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Tips</span>
                </div>
            </div>
            <div class="content">
                <p class="tips__subtitle">Featured Tips</p>
                <div id="tips__featured-tips">
                    <div v-for="tip of tips" class="tips__featured-tip" @click="router.push('/tips/tip/' + tip.id);">
                        <div class="tips__featured-tip__card" :style="{ backgroundImage: 'url(' + (tip.get('image') ? tip.get('image').url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y') + ')' }"></div>
                        <span>{{ tip.get('title') }}</span>
                    </div>
                </div>
                <hr>
                <p class="tips__subtitle">Tips by Utility</p>
                <div id="tips__utilities">
                    <div class="tips__utility" @click="router.push('/tips/utility/Water');">
                        <div class="tips__utility__card">
                            <i class="fas fa-tint"></i>
                        </div>
                        <span>Water</span>
                    </div>
                    <div class="tips__utility" @click="router.push('/tips/utility/Gas');">
                        <div class="tips__utility__card">
                            <i class="fas fa-fire"></i>
                        </div>
                        <span>Gas</span>
                    </div>
                    <div class="tips__utility" @click="router.push('/tips/utility/Electricity');">
                        <div class="tips__utility__card">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <span>Electricity</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            tips: []
        };
    },
    created: function () {
        let vm = this;
        let tipQuery = new AV.Query('Tip');
        tipQuery.descending('createdAt');
        tipQuery.find().then(function (tips) {
            vm.tips = tips;
        });
    }
};
const AppTipsUtility = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>{{ $route.params.name }} Tips</span>
                </div>
                <div class="titlebar__left" @click="router.back();">
                    <i class="fas fa-angle-left">
                </div>
            </div>
            <div class="content">
                <div v-for="tip of tips" class="utility__tip" @click="router.push('/tips/tip/' + tip.id);">
                    <div :style="{ backgroundImage: 'url(' + (tip.get('image') ? tip.get('image').url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y') + ')' }"></div>
                    <h1>{{ tip.get('title') }}</h1>
                    <hr>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            tips: []
        };
    },
    created: function () {
        let vm = this;
        let tipQuery = new AV.Query('Tip');
        tipQuery.equalTo('utility', vm.$route.params.name);
        tipQuery.descending('createdAt');
        tipQuery.find().then(function (tips) {
            vm.tips = tips;
        });
    }
};
const AppTipsTip = {
    template: `
        <div>
            <div class="titlebar">
                <div class="titlebar__title">
                    <span>Tip</span>
                </div>
                <div class="titlebar__left" @click="router.back();">
                    <i class="fas fa-angle-left">
                </div>
            </div>
            <div class="content">
                <div id="tip__image" :style="{ backgroundImage: 'url(' + (image ? image.url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y') + ')' }"></div>
                <div id="tip__content">
                    <h1>{{ title }}</h1>
                    <p>{{ content }}</p>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            image: new AV.File(),
            title: '',
            content: ''
        };
    },
    created: function () {
        let vm = this;
        new AV.Query('Tip').get(vm.$route.params.id).then(function (tip) {
            vm.image = tip.get('image');
            vm.title = tip.get('title');
            vm.content = tip.get('content');
        });
    }
};
const AppTips = {
    template: `
        <router-view></router-view>
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
                <div class="profile__header">
                    <div class="profile__header__image">
                        <img :src="profilePicture ? profilePicture.url() : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" @click="document.getElementById('profile__header__image').click();">
                        <input id="profile__header__image" type="file" style="display: none;" @change="uploadProfilePicture()">
                    </div>
                    <div class="profile__header__info">
                        <p class="profile__header__name">{{ firstName }} {{ lastName }}</p>
                        <p class="profile__header__tier">EcoTier: {{ ecoTier }}</p>
                        <p class="profile__header__social"><span>{{ followers.length }} Followers</span><span>{{ followees.length }} Following</span></p>
                    </div>
                </div>
                <hr>
                <div>
                    <div v-for="achievement in achievements">
                        <div class="profile__achievement" style="height: 96px;">
                            <div class="profile__achievement__info" style="left: 16px;">
                                <p class="profile__achievement__info__text">Achieved a new {{ achievement.get('content').type }}!</p>
                                <p v-if="achievement.get('content').type === 'EcoStatus'" class="profile__achievement__info__text">Tier: {{ achievement.get('content').tier }}</p>
                                <p v-if="achievement.get('content').type === 'Streak'" class="profile__achievement__info__text">Days: {{ achievement.get('content').days }}</p>
                                <p @click="like(achievement);" class="profile__achievement__info__text"><i class="far fa-heart"></i> {{ achievement.get('likedBy').length }}</p>
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
        let achievementQuery = new AV.Query('Achievement');
        achievementQuery.equalTo('user', AV.User.current());
        achievementQuery.descending('createdAt');
        achievementQuery.find().then(function (achievements) {
            vm.achievements = achievements;
        });
        let followeeQuery = AV.User.current().followeeQuery();
        followeeQuery.include('followee');
        followeeQuery.find().then(function (followees) {
            vm.followees = followees;
        });
        let followerQuery = AV.User.current().followerQuery();
        followerQuery.include('follower');
        followerQuery.find().then(function (followers) {
            vm.followers = followers;
        });
    },
    methods: {
        like: function (achievement) {
            let found = false;
            for (let i = 0; i < achievement.get('likedBy').length; i++) {
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
            let file = new AV.File(name, document.getElementById('profile__header__image').files[0]);
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
                <div class="titlebar__left" @click="router.back();">
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
                        <input class="settings__item__value" :value="householdSize" @input="householdSize = parseInt($event.target.value) || 0;"></input>
                    </div>
                    <hr>
                    <div class="settings__item" @click="changePassword();">
                        <span class="settings__item__name">Change Password</span>
                        <span class="settings__item__right"><i class="fas fa-angle-right"></i></span>
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
                <p class="settings__subtitle">Services</p>
                <div>
                    <div class="settings__item">
                        <span class="settings__item__name">Southern California Edison</span>
                        <span class="settings__item__right"><i class="fas fa-angle-right"></i></span>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">Irvine Ranch Water District</span>
                        <span class="settings__item__right"><i class="fas fa-angle-right"></i></span>
                    </div>
                    <hr>
                    <div class="settings__item">
                        <span class="settings__item__name">SoCal Gas</span>
                        <span class="settings__item__right"><i class="fas fa-angle-right"></i></span>
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
            if (confirm('Are you sure to log out?')) {
                AV.User.logOut().then(function () {
                    location.href = '/';
                });
            }
        },
        changePassword: function () {
            let tempPass = prompt('Enter new password:');
            if (tempPass) {
                let tempPass2 = prompt('Enter new password again:');
                if (tempPass2) {
                    if (tempPass === tempPass2) {
                        AV.User.current().set('password', tempPass);
                        AV.User.current().save().then(function () {
                            alert('Password changed.');
                        });
                    }
                    else {
                        alert('Password does not match, try again.');
                    }
                }
            }
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
                    path: 'electricity',
                    component: AppHomeElectricity
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
            path: '/user/:id',
            component: AppUser
        },
        {
            path: '/social',
            component: AppSocial,
            children: [
                {
                    path: '',
                    component: AppSocialHome
                },
                {
                    path: 'results/:keyword',
                    component: AppSocialResults
                }
            ]
        },
        {
            path: '/tips',
            component: AppTips,
            children: [
                {
                    path: '',
                    component: AppTipsHome
                },
                {
                    path: 'utility/:name',
                    component: AppTipsUtility
                },
                {
                    path: 'tip/:id',
                    component: AppTipsTip
                }
            ]
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
                                    <img :src="'/images/' + app.icon">
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