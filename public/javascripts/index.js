AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
new Vue({
    el: '#main',
    template: `
        <div id="wrapper">
            <section id="logo">
                <img src="../images/logo.png">
            </section>
            <section id="tree">
                <img src="../images/tree.png">
            </section>
            <section id="sign-in">
                <a href="/auth">
                    <button>Sign In <i class="fas fa-chevron-right"></i></button>
                </a>
            </section>
            <section id="create-account">
                <a href="/auth?signup=true">
                    <button>Create Account</button>
                </a>
            </section>
        </div>
    `,
    created: function () {
        Promise.resolve(AV.User.current()).then(user => user ? user.isAuthenticated().then(authenticated => authenticated ? user : null) : null).then(user => {
            if (user) {
                location.href = '/home';
            }
        });
    }
});