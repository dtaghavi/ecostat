AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
new Vue({
    el: '#main',
    template: `
        <div>
            <section>
                <img id="logo" src="../images/logo.png">
                <img id="tree" src="../images/tree.png">
            </section>
            <section>
                <a href="/auth">
                    <button id="sign-up">Sign In <i class="fas fa-chevron-right"></i></button>
                </a>
            </section>
            <section>
                <a href="/auth?signup=true">
                    <button id="log-in">Create Account</button>
                </a>
            </section>
        </div>
    `,
    created: function () {
        let vm = this;
        Promise.resolve(AV.User.current()).then(user => user ? user.isAuthenticated().then(authenticated => authenticated ? user : null) : null).then(user => {
            if (user) {
                location.href = '/home';
            }
        });
    }
});