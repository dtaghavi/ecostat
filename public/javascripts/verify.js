AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
new Vue({
    el: '#main',
    template: `
        <div id="wrapper">
            <div id="branding">
                <a href="/">
                    <svg id="branding__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300"><title>GPA.IO</title><rect x="475" y="206" width="16" height="16"/><path d="M213,142H144.61v16h59.86a60,60,0,1,1-17-50.43l11.31-11.31A76,76,0,1,0,221,150,8,8,0,0,0,213,142Z"/><rect x="507" y="78" width="16" height="144"/><path d="M615,74a76,76,0,1,0,76,76A76.08,76.08,0,0,0,615,74Zm0,136a60,60,0,1,1,60-60A60.07,60.07,0,0,1,615,210Z"/><path d="M333,126c0-25.3-19.88-45.48-47.28-48-10.32-.94-39.72-.06-41,0A8,8,0,0,0,237,86v79.88l-.24,7.88H237V222h16V174.2c9.81.2,25.69.41,32.72-.23C313.12,171.48,333,151.3,333,126Zm-48.72,32c-6,.55-20.93.39-31.28.17V93.8c10.35-.21,25.31-.38,31.28.17,19,1.72,32.72,15.19,32.72,32S303.24,156.31,284.28,158Z"/><path d="M386,78a8,8,0,0,0-7.16,4.42L309.06,222h17.88l24-48h70.12l24,48h17.88L393.16,82.42A8,8,0,0,0,386,78Zm-27.06,80L386,103.89,413.06,158Z"/></svg>
                    <p id="branding__slogan">We See Your Excellence <i class="far fa-smile-wink"></i></p>
                </a>
            </div>
            <div id="account">
                <dl class="cards">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <h1>Email Verification</h1>
                                <p>{{ message }}</p>
                            </section>
                            <section v-if="done">
                                <button class="primary" @click="location.href = '/auth';">
                                    <span>Back to GPA.IO</span>
                                    <i class="far fa-arrow-right"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
    `,
    data: function () {
        return {
            message: 'One moment please…',
            done: false
        };
    },
    created: function () {
        let vm = this;
        let token = location.search.match(/token=(\w*)/);
        if (token && token[1]) {
            token = token[1];
        }
        fetch('https://us.leancloud.cn/1.1/verifyEmail/' + token).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data['error']) {
                vm.message = 'This link has already expired. Please make a new request to verify your email.';
            }
            else {
                vm.message = 'Your email is successfully verified.';
            }
            vm.done = true;
        });
    }
});