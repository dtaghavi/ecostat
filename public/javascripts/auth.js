AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
Promise.resolve(AV.User.current()).then(user => user ? user.isAuthenticated().then(authenticated => authenticated ? user : null) : null).then(user => {
    if (user) {
        location.href = '/home';
    }
    else {
        new Vue({
            el: '#main',
            template: `
                <div>
                    <section>
                        <img id="logo" src="../images/logo.png">
                    </section>
                    <section>
                        <input v-if="creatingAccount" id="first-name" placeholder="First" v-model="firstName">
                        <input v-if="creatingAccount" id="last-name" placeholder="Last" v-model="lastName">
                        <input v-if="creatingAccount" placeholder="Zip Code" v-model="zipCode">
                        <input type="email" placeholder="Email" v-model="email">
                        <input type="password" placeholder="Password" v-model="password">
                        <button @click="go();">{{ creatingAccount ? 'Create Account' : 'Sign In' }}</button>
                        <button id="reset" class="minor-button" @click="requestPasswordReset();">Reset Password</button>
                    </section>
                    <section>
                        <button id="create" class="minor-button" @click="password = ''; creatingAccount = !creatingAccount;">{{ creatingAccount ? 'Back to Log in' : 'Create Account' }}</button>
                    </section>
                </div>
            `,
            data: function () {
                return {
                    creatingAccount: location.search.match(/signup=true/) ? true : false,
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    zipCode: ''
                };
            },
            methods: {
                go: function () {
                    let vm = this;
                    if (vm.creatingAccount) {
                        if (!vm.email) {
                            alert('Please enter your email address.');
                        }
                        else if (vm.password.length < 6) {
                            alert('Your password must be at least 6 digits.');
                        }
                        else {
                            let user = new AV.User();
                            user.setUsername(vm.email);
                            user.setEmail(vm.email);
                            user.setPassword(vm.password);
                            user.set('firstName', vm.firstName);
                            user.set('lastName', vm.lastName);
                            user.set('zipCode', vm.zipCode);
                            user.signUp().then(function () {
                                location.href = '/home';
                            }, function (error) {
                                if (error.code === 125) {
                                    alert('The email address you entered is not a valid one. Please check your input.');
                                }
                                else if (error.code === 203) {
                                    alert('The email address you entered is already used for another account.');
                                }
                                else {
                                    alert('An unknown error has occurred. Please let our staff know about this and we will be happy to help you out!');
                                }
                            });
                        }
                    }
                    else {
                        if (!vm.email) {
                            alert('Please enter your email address.');
                        }
                        else {
                            AV.User.logIn(vm.email, vm.password).then(function () {
                                location.href = '/home';
                            }, function (error) {
                                if (error.code === 210) {
                                    alert('The email or password you provided is incorrect. Please try again.');
                                }
                                else if (error.code === 211) {
                                    alert('We could not find a user with the email address provided.');
                                }
                                else {
                                    alert('An unknown error has occurred. Please let our staff know about this and we will be happy to help you out!');
                                }
                            });
                        }
                    }
                },
                requestPasswordReset: function () {
                    let vm = this;
                    let email = vm.email || prompt('Please enter your email address:');
                    if (email) {
                        AV.User.requestPasswordReset(email).then(function () {
                            alert('You will receive an email with instructions to reset your password.');
                        }, function (error) {
                            if (error.code === 205) {
                                alert('We could not find a user with the email address provided.');
                            }
                            else {
                                alert('An unknown error has occurred. Please let our staff know about this and we will be happy to help you out!');
                            }
                        });
                    }
                }
            }
        });
    }
});