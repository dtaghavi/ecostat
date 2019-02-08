AV.init({
    appId: 'nfqKf61gp2Ph7VotqNjzI5pl-MdYXbMMI',
    appKey: 'bzBydd5WRzh72j70vL9iwfIJ'
});
const ModalWrapper = {
    template: `
        <div id="modal-wrapper">
            <slot></slot>
        </div>
    `
};
const AppDashboardHomeEnrollment = {
    template: `
        <div :class="['card', 'card--padded', 'card--half', 'app-dashboard__home__enrollment', enrollment.get('courseOffering').get('term').get('startingAt') <= new Date() && enrollment.get('courseOffering').get('term').get('endingAt') >= new Date() ? 'app-dashboard__home__enrollment--present' : '']" @click="router.push('/dashboard/view/' + enrollment.id);">
            <div class="app-dashboard__home__enrollment__basic-info">
                <h2>
                    <span>{{ enrollment.get('courseOffering').get('course').get('number') }}</span>
                    <span class="button-icon" title="Drop course." @click.stop="drop();">
                        <i class="far fa-trash-alt"></i>
                    </span>
                </h2>
                <p><b>{{ enrollment.get('courseOffering').get('units') }} {{ enrollment.get('courseOffering').get('units') === 1 ? 'unit' : 'units' }}</b></p>
            </div>
            <div v-if="grade.coveredPercentage" class="app-dashboard__home__enrollment__progress">
                <svg class="app-dashboard__home__enrollment__progress__ring">
                    <circle class="app-dashboard__home__enrollment__progress__ring__full" cx="50%" cy="50%" r="50%"></circle>
                    <circle class="app-dashboard__home__enrollment__progress__ring__covered" cx="50%" cy="50%" r="50%" :style="{ strokeDasharray: Math.PI * 56 * grade.coveredPercentage / grade.fullPercentage + ' ' + Math.PI * 56 * (1 - grade.coveredPercentage / grade.fullPercentage) }"></circle>
                    <circle class="app-dashboard__home__enrollment__progress__ring__earned" cx="50%" cy="50%" r="50%" :style="{ strokeDasharray: Math.PI * 56 * grade.earnedPercentage / grade.fullPercentage + ' ' + Math.PI * 56 * (1 - grade.earnedPercentage / grade.fullPercentage) }"></circle>
                </svg>
                <div class="app-dashboard__home__enrollment__progress__letter">{{ letterGrade(grade.earnedPercentage, grade.coveredPercentage, grade.fullPercentage).letter }}<sup>{{ letterGrade(grade.earnedPercentage, grade.coveredPercentage, grade.fullPercentage).markup }}</sup></div>
            </div>
            <div class="app-dashboard__home__enrollment__info">
                <ul v-if="enrollment.get('courseOffering').get('term').get('endingAt') <= new Date()">
                    <li>
                        <span>Ended on {{ flatpickr.formatDate(enrollment.get('courseOffering').get('term').get('endingAt'), 'n/j/Y') }}</span>
                    </li>
                </ul>
                <ul v-if="enrollment.get('courseOffering').get('term').get('startingAt') <= new Date() && enrollment.get('courseOffering').get('term').get('endingAt') >= new Date()">
                    <li v-for="taskGroup in enrollment.get('taskGroups')">
                        <span>{{ taskGroup.name }}</span>
                        <span>{{ taskGroup.isTest ? taskGroup.tasks.filter(task => task.completed || task.due && task.due < new Date()).length : taskGroup.tasks.filter(task => task.completed).length }}/{{ taskGroup.tasks.length }}</span>
                    </li>
                </ul>
                <ul v-if="enrollment.get('courseOffering').get('term').get('startingAt') >= new Date()">
                    <li>
                        <span>Starting on {{ flatpickr.formatDate(enrollment.get('courseOffering').get('term').get('startingAt'), 'n/j/Y') }}</span>
                    </li>
                </ul>
            </div>
        </div>
    `,
    props: {
        enrollment: Object
    },
    computed: {
        grade: function () {
            let vm = this;
            let earnedPercentage = 0;
            let coveredPercentage = 0;
            let uncompletedPercentage = 0;
            let fullPercentage = 100;
            for (let taskGroup of vm.enrollment.get('taskGroups')) {
                let tasksWithScores = [];
                for (let task of taskGroup.tasks) {
                    if (typeof task.myScore === 'number' && typeof task.totalScore === 'number') {
                        tasksWithScores.push({
                            percentage: task.percentage ? task.percentage : taskGroup.percentage / taskGroup.tasks.length,
                            myScore: task.myScore,
                            totalScore: task.totalScore
                        });
                    }
                    else {
                        uncompletedPercentage += task.percentage ? task.percentage : taskGroup.percentage / taskGroup.tasks.length;
                    }
                }
                if (taskGroup.drop) {
                    tasksWithScores.sort((a, b) => {
                        return b.myScore / b.totalScore - a.myScore / a.totalScore;
                    });
                    for (let i = 0; i < Math.min(taskGroup.drop, tasksWithScores.length - 1); i++) {
                        fullPercentage -= tasksWithScores.pop().percentage;
                    }
                }
                for (let taskWithScores of tasksWithScores) {
                    earnedPercentage += taskWithScores.percentage * taskWithScores.myScore / taskWithScores.totalScore;
                    coveredPercentage += taskWithScores.percentage;
                }
            }
            return { earnedPercentage, coveredPercentage, uncompletedPercentage, fullPercentage };
        }
    },
    methods: {
        drop: function () {
            let vm = this;
            if (confirm('Are you sure to drop ' + vm.enrollment.get('courseOffering').get('course').get('number') + ' (' + vm.enrollment.get('courseOffering').get('code') + ') from your study list? This will delete all the tasks associated with this course and is irreversible!')) {
                vm.enrollment.destroy();
            }
        },
        letterGrade: function (earnedPercentage, coveredPercentage, fullPercentage) {
            let vm = this;
            for (let grade of vm.enrollment.get('courseOffering').get('course').get('school').get('gradingStandard')) {
                if (earnedPercentage / Math.min(coveredPercentage, fullPercentage) >= grade.threshold) {
                    return {
                        letter: grade.letter,
                        markup: grade.markup || ''
                    };
                }
            }
        }
    }
};
const AppDashboardHome = {
    components: {
        'app-dashboard-home-enrollment': AppDashboardHomeEnrollment
    },
    template: `
        <dl class="cards">
            <div v-if="loaded">
                <dd>
                    <div class="card card--padded">
                        <h1>{{ flatpickr.formatDate(new Date(), 'l, F J') }}</h1>
                        <p><b>{{ enrollmentsInfo }}</b></p>
                        <p v-if="quote.content">{{ quote.content }}{{ quote.author ? ' — ' + quote.author : '' }}</p>
                    </div>
                </dd>
                <dt>Ongoing Courses</dt>
                <dd v-if="tutorial">
                    <div v-if="!enrollments.length" class="card card--padded card--tutorial">
                        <p>Welcome to GPA.IO! We help you track your assignments and exams, predict your grades and GPA, remind you of your upcoming to-dos, and keep you ahead of your courses. Let’s get started by clicking on the <span title="“add a course”"><i class="far fa-plus"></i></span> button below to add you first course!</p>
                    </div>
                </dd>
                <dd>
                    <app-dashboard-home-enrollment v-for="enrollment in presentEnrollments" :enrollment="enrollment"></app-dashboard-home-enrollment>
                    <div class="card card--add card--half app-dashboard__home__enrollment app-dashboard__home__enrollment--present" title="Add a course." @click="router.push('/dashboard/add');">
                        <i class="fal fa-plus"></i>
                    </div>
                </dd>
                <dt v-if="futureEnrollments.length">Upcoming Courses</dt>
                <dd>
                    <app-dashboard-home-enrollment v-for="enrollment in futureEnrollments" :enrollment="enrollment"></app-dashboard-home-enrollment>
                </dd>
                <dt v-if="pastEnrollments.length">Past Enrollments</dt>
                <dd>
                    <app-dashboard-home-enrollment v-for="enrollment in pastEnrollments" :enrollment="enrollment"></app-dashboard-home-enrollment>
                </dd>
            </div>
            <div v-else>
                <dt>Loading…</dt>
            </div>
        </dl>
    `,
    data: function () {
        return {
            tutorial: AV.User.current().get('tutorial').dashboard,
            loaded: false,
            quote: {},
            enrollments: []
        };
    },
    computed: {
        pastEnrollments: function () {
            let vm = this;
            return vm.enrollments.filter(enrollment => enrollment.get('courseOffering').get('term').get('endingAt') <= new Date());
        },
        presentEnrollments: function () {
            let vm = this;
            return vm.enrollments.filter(enrollment => enrollment.get('courseOffering').get('term').get('startingAt') <= new Date() && enrollment.get('courseOffering').get('term').get('endingAt') >= new Date());
        },
        futureEnrollments: function () {
            let vm = this;
            return vm.enrollments.filter(enrollment => enrollment.get('courseOffering').get('term').get('startingAt') >= new Date());
        },
        numberOfCourses: function () {
            let vm = this;
            return vm.presentEnrollments.length;
        },
        numberOfUnits: function () {
            let vm = this;
            return vm.presentEnrollments.reduce((numberOfUnits, enrollment) => {
                return numberOfUnits + enrollment.get('courseOffering').get('units');
            }, 0);
        },
        enrollmentsInfo: function () {
            let vm = this;
            return !vm.presentEnrollments.length ? !vm.futureEnrollments.length ? 'You have no course going on. Get started by adding one.' : 'Ready for your upcoming ' + (vm.futureEnrollments.length === 1 ? vm.futureEnrollments[0].get('courseOffering').get('course').get('number') + '?' : vm.futureEnrollments.length + ' courses?') : vm.presentEnrollments.length + ' ' + (vm.presentEnrollments.length === 1 ? ' course' : ' courses') + ', ' + vm.numberOfUnits + ' ' + (vm.numberOfUnits === 1 ? ' unit' : ' units') + '.';
        }
    },
    created: function () {
        let vm = this;
        AV.Cloud.run('getQuote').then(function (data) {
            vm.quote = data;
        });
        let enrollmentQuery = new AV.Query('Enrollment');
        enrollmentQuery.equalTo('user', AV.User.current());
        enrollmentQuery.include('courseOffering');
        enrollmentQuery.include('courseOffering.term');
        enrollmentQuery.include('courseOffering.course');
        enrollmentQuery.include('courseOffering.course.school');
        enrollmentQuery.ascending('createdAt');
        enrollmentQuery.limit(1000);
        enrollmentQuery.find().then(function (enrollments) {
            vm.enrollments = enrollments;
            vm.loaded = true;
        });
        enrollmentQuery.subscribe().then(function (liveQuery) {
            liveQuery.on('create', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('update', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('enter', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('leave', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('delete', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
        });
    }
};
const AppDashboardViewTask = {
    components: {
        'modal-wrapper': ModalWrapper
    },
    template: `
        <div class="card card--half app-dashboard__view__task">
            <div :class="['app-dashboard__view__task__complete', task.completed || taskGroup.isTest && task.due && task.due < new Date() ? 'app-dashboard__view__task__complete--completed' : '']" :title="taskGroup.isTest ? task.completed ? task.due && task.due < new Date() ? 'Completed.' : typeof task.myScore === 'number' ? 'Completed. Click to mark as unreviewed.' : 'Reviewed. Click to mark as unreviewed.' : task.due && task.due < new Date() ? 'Completed.' : 'Mark as reviewed and dismiss from Tasks.' : task.completed ? 'Completed. Click to mark as uncompleted.' : 'Mark as completed.'" @click="toggleCompleted();">
                <i :class="['far', taskGroup.isTest ? task.due && task.due < new Date() || typeof task.myScore === 'number' ? 'fa-check' : 'fa-smile' : 'fa-check']"></i>
            </div>
            <div class="app-dashboard__view__task__main">
                <div>
                    <h2>
                        <span>{{ taskGroup.name }}{{ taskGroup.tasks.length === 1 ? '' : ' ' + (taskGroup.tasks.indexOf(task) + 1) }}</span>
                        <span class="button-icon" title="Delete task." @click="drop();">
                            <i class="far fa-trash-alt"></i>
                        </span>
                    </h2>
                    <p>
                        <span ref="date">
                            <b>{{ task.due ? (taskGroup.isTest ? 'At ' : 'Due ') + flatpickr.formatDate(task.due, 'n/j h:iK') : 'Undated' }}</b>
                            <span class="button-icon" title="Edit date.">
                                <i class="far fa-calendar-edit"></i>
                            </span>
                        </span>
                    </p>
                    <p>
                        <span>{{ task.percentage ? task.percentage : parseFloat((taskGroup.percentage / taskGroup.tasks.length).toFixed(1)) }}%</span>
                        <span v-if="!taskGroup.percentage" class="button-icon" title="Edit percentage." @click="resetPendingChanges(); store.commit('openModal'); editingPercentage = true;"><i class="far fa-edit"></i></span>
                    </p>
                </div>
                <div class="app-dashboard__view__task__main__score">
                    <input type="text" :value="task.myScore" @keypress.esc="$event.target.value = task.myScore; $event.target.blur();" @keypress.enter="$event.target.nextElementSibling.nextElementSibling.focus(); $event.target.nextElementSibling.nextElementSibling.select();" @blur="saveMyScore($event.target.value);"><span>/</span><input type="text" :value="task.totalScore" @keypress.esc="$event.target.value = task.totalScore; $event.target.blur();" @keypress.enter="$event.target.blur();" @blur="saveTotalScore($event.target.value);">
                </div>
            </div>
            <modal-wrapper v-if="editingPercentage">
                <dl class="cards">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <h1>Edit Percentage</h1>
                                <div class="field">
                                    <label for="app-dashboard__view__task__edit-percentage">Percentage of This Task</label>
                                    <input type="text" id="app-dashboard__view__task__edit-percentage" v-focus v-model="pendingChanges.percentage" placeholder="Example: 10" @keypress.enter="$event.target.blur(); savePercentage();">
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="savePercentage();">
                                    <span>Done</span>
                                    <i class="far fa-check"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section>
                                <button @click="editingPercentage = false; store.commit('closeModal'); resetPendingChanges();">
                                    <span>Discard Changes</span>
                                    <i class="far fa-times"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </dl>
            </modal-wrapper>
        </div>
    `,
    props: {
        task: Object,
        taskGroup: Object,
        enrollment: Object
    },
    data: function () {
        return {
            editingPercentage: false,
            pendingChanges: {
                percentage: this.task.percentage || ''
            }
        };
    },
    methods: {
        resetPendingChanges: function () {
            let vm = this;
            vm.pendingChanges = {
                percentage: this.task.percentage || ''
            };
        },
        toggleCompleted: function () {
            let vm = this;
            if (vm.taskGroup.isTest && vm.task.completed && !(vm.task.due && vm.task.due < new Date()) || !vm.taskGroup.isTest && vm.task.completed) {
                if (typeof vm.task.myScore === 'number') {
                    if (confirm('Doing so will erase the score you have entered for this task. Continue?')) {
                        vm.task.myScore = null;
                        vm.task.completed = false;
                    }
                }
                else {
                    vm.task.completed = false;
                }
            }
            else if (vm.taskGroup.isTest && !vm.task.completed && !(vm.task.due && vm.task.due < new Date()) || !vm.taskGroup.isTest && !vm.task.completed) {
                vm.task.completed = true;
            }
            vm.enrollment.save();
        },
        drop: function () {
            let vm = this;
            if (vm.task.myScore === null || confirm('You have already entered your score for this task. Are you sure to delete it?')) {
                vm.taskGroup.tasks.splice(vm.taskGroup.tasks.indexOf(vm.task), 1);
            }
            vm.enrollment.save();
        },
        savePercentage: function () {
            let vm = this;
            if (!(parseFloat(vm.pendingChanges.percentage) >= 0)) {
                alert('Please enter the percentage of this task.');
            }
            else {
                vm.task.percentage = parseFloat(vm.pendingChanges.percentage);
                vm.enrollment.save().then(function () {
                    vm.editingPercentage = false;
                    store.commit('closeModal');
                    vm.resetPendingChanges();
                });
            }
        },
        saveMyScore: function (score) {
            let vm = this;
            if (parseFloat(score) >= 0) {
                vm.task.myScore = parseFloat(score);
                vm.task.completed = true;
            }
            else {
                vm.task.myScore = null;
            }
            vm.enrollment.save();
        },
        saveTotalScore: function (score) {
            let vm = this;
            if (parseFloat(score) > 0) {
                vm.task.totalScore = parseFloat(score);
            }
            else {
                vm.task.totalScore = null;
            }
            vm.enrollment.save();
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    },
    mounted: function () {
        let vm = this;
        vm.datePicker = flatpickr(vm.$refs.date, {
            disableMobile: true,
            enableTime: true,
            defaultDate: vm.task.due,
            onChange: function (selectedDates) {
                vm.task.due = selectedDates[0];
                vm.enrollment.save();
            }
        });
    },
    beforeDestroy: function () {
        let vm = this;
        vm.datePicker.destroy();
    }
};
const AppDashboardViewTaskGroup = {
    components: {
        'app-dashboard-view-task': AppDashboardViewTask,
        'modal-wrapper': ModalWrapper
    },
    template: `
        <div>
            <dt>
                <span>{{ taskGroup.name }} — {{ taskGroup.percentage ? taskGroup.percentage + '% Evenly Split' : parseFloat(totalPercentage.toFixed(1)) + '% in Total' }}</span>
                <span class="button-icon" title="Edit group." @click="resetPendingChanges(); store.commit('openModal'); editing = true;">
                    <i class="far fa-edit"></i>
                </span>
                <span class="button-icon"  title="Delete group." @click="drop();">
                    <i class="far fa-trash-alt"></i>
                </span>
            </dt>
            <dd>
                <app-dashboard-view-task v-for="task in taskGroup.tasks" :task="task" :taskGroup="taskGroup" :enrollment="enrollment"></app-dashboard-view-task>
                <div class="card card--add card--half app-dashboard__view__task" title="Add a task." @click="add();">
                    <i class="fal fa-plus"></i>
                </div>
            </dd>
            <modal-wrapper v-if="editing">
                <dl class="cards">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <h1>Edit Group</h1>
                                <div class="field">
                                    <input type="checkbox" id="app-dashboard__view__task-group__editing__type" v-model="pendingChanges.isTest">
                                    <label for="app-dashboard__view__task-group__editing__type">Tasks Within This Group Are Exams</label>
                                </div>
                                <div class="field">
                                    <label for="app-dashboard__view__task-group__editing__name">What is the name of them?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__name" v-model="pendingChanges.name" :placeholder="pendingChanges.isTest ? 'Example: Quiz' : 'Example: Homework'">
                                </div>
                                <div class="field">
                                    <input type="checkbox" id="app-dashboard__view__task-group__editing__same-percentage" v-model="pendingChanges.samePercentage">
                                    <label for="app-dashboard__view__task-group__editing__same-percentage">All Tasks Take up the Same Percentage</label>
                                </div>
                                <div v-if="pendingChanges.samePercentage" class="field">
                                    <label for="app-dashboard__view__task-group__editing__percentage">What is the total percentage they take up?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__percentage" v-model="pendingChanges.percentage" placeholder="Example: 40">
                                </div>
                                <div v-if="pendingChanges.samePercentage" class="field">
                                    <label for="app-dashboard__view__task-group__editing__drop">How many lowest scores will be dropped?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__drop" v-model="pendingChanges.drop" placeholder="Example: 1">
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="saveChanges();">
                                    <span>Done</span>
                                    <i class="far fa-check"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section>
                                <button @click="editing = false; store.commit('closeModal'); resetPendingChanges();">
                                    <span>Discard Changes</span>
                                    <i class="far fa-times"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </dl>
            </modal-wrapper>
        </div>
    `,
    props: {
        taskGroup: Object,
        enrollment: Object
    },
    data: function () {
        return {
            editing: false,
            pendingChanges: {
                isTest: this.taskGroup.isTest,
                name: this.taskGroup.name,
                samePercentage: this.taskGroup.percentage ? true : false,
                percentage: this.taskGroup.percentage || parseFloat(this.taskGroup.tasks.reduce((percentage, task) => {
                    return percentage + task.percentage;
                }, 0).toFixed(1)),
                drop: this.taskGroup.drop || ''
            }
        };
    },
    computed: {
        totalPercentage: function () {
            let vm = this;
            return vm.taskGroup.tasks.reduce((totalPercentage, task) => {
                return totalPercentage + task.percentage;
            }, 0);
        }
    },
    methods: {
        resetPendingChanges: function () {
            let vm = this;
            vm.pendingChanges = {
                isTest: this.taskGroup.isTest,
                name: this.taskGroup.name,
                samePercentage: this.taskGroup.percentage ? true : false,
                percentage: this.taskGroup.percentage || parseFloat(this.taskGroup.tasks.reduce((percentage, task) => {
                    return percentage + task.percentage;
                }, 0).toFixed(1)),
                drop: this.taskGroup.drop || ''
            };
        },
        add: function () {
            let vm = this;
            vm.taskGroup.tasks.push({
                percentage: typeof vm.taskGroup.percentage === 'number' ? null : 0,
                due: null,
                completed: false,
                pinned: false,
                myScore: null,
                totalScore: null
            });
            vm.enrollment.save();
        },
        drop: function () {
            let vm = this;
            if (confirm('Are you sure to delete this group?')) {
                vm.enrollment.get('taskGroups').splice(vm.enrollment.get('taskGroups').indexOf(vm.taskGroup), 1);
            }
            vm.enrollment.save();
        },
        saveChanges: function () {
            let vm = this;
            if (!vm.pendingChanges.name) {
                alert('Please enter the name for the tasks.');
            }
            else if (vm.pendingChanges.samePercentage && !(parseFloat(vm.pendingChanges.percentage) >= 0)) {
                alert('Please enter the total percentage.');
            }
            else {
                vm.taskGroup.isTest = vm.pendingChanges.isTest;
                vm.taskGroup.name = vm.pendingChanges.name;
                if (vm.pendingChanges.samePercentage) {
                    vm.taskGroup.percentage = parseFloat(vm.pendingChanges.percentage) || 0;
                    vm.taskGroup.drop = parseFloat(vm.pendingChanges.drop) || 0;
                    for (let task of vm.taskGroup.tasks) {
                        task.percentage = null;
                    }
                }
                else {
                    if (vm.taskGroup.percentage) {
                        for (let task of vm.taskGroup.tasks) {
                            task.percentage = parseFloat((vm.taskGroup.percentage / vm.taskGroup.tasks.length).toFixed(1));
                        }
                    }
                    vm.taskGroup.percentage = null;
                    vm.taskGroup.drop = null;
                }
                vm.enrollment.save().then(function () {
                    vm.editing = false;
                    store.commit('closeModal');
                    vm.resetPendingChanges();
                });
            }
        }
    }
};
const AppDashboardView = {
    components: {
        'app-dashboard-view-task-group': AppDashboardViewTaskGroup,
        'modal-wrapper': ModalWrapper
    },
    template: `
        <dl class="cards">
            <div v-if="loaded">
                <dd>
                    <div class="card card--padded">
                        <h1>{{ enrollment.get('courseOffering').get('course').get('number') }}</h1>
                        <p><b>{{ enrollment.get('courseOffering').get('units') }} {{ enrollment.get('courseOffering').get('units') === 1 ? 'unit' : 'units' }}</b></p>
                        <p>{{ parseFloat(grade.coveredPercentage.toFixed(1)) }}% covered, including {{ parseFloat(grade.earnedPercentage.toFixed(1)) }}% earned, {{ parseFloat((grade.coveredPercentage - grade.earnedPercentage).toFixed(1)) }}% lost.</p>
                        <p>{{ grade.coveredPercentage ? grade.uncompletedPercentage ? 'It is possible for you to get a grade of ' + letterGrade(grade.earnedPercentage + grade.uncompletedPercentage, grade.fullPercentage, grade.fullPercentage).letter + letterGrade(grade.earnedPercentage + grade.uncompletedPercentage, grade.fullPercentage, grade.fullPercentage).markup + ' with ' + parseFloat(((grade.earnedPercentage + grade.uncompletedPercentage) / grade.fullPercentage * 100).toFixed(1)) + '% if you get full scores for all the remaining tasks.' : 'You have completed this course with a grade of ' + letterGrade(grade.earnedPercentage, grade.coveredPercentage, grade.fullPercentage).letter + letterGrade(grade.earnedPercentage, grade.coveredPercentage, grade.fullPercentage).markup + '.' : 'The highest grade you can get will show up here once you start putting in your scores.' }}</p>
                        <p>{{ enrollment.get('countsIntoGpa') ? 'The grade of this course counts into your GPA.' : 'The grade of this course does not count into your GPA.'}}</p>
                    </div>
                </dd>
                <dd v-if="tutorial">
                    <div v-if="!enrollment.get('taskGroups').length" class="card card--padded card--tutorial">
                        <p>You just added your first course. The next thing we ask you to do is to pull out the syllabus of this course and reproduce the grading criteria here. For each category appearing on your grading criteria (Homework, Quiz, Project, Midterm, Final, etc.), create a new group for it by clicking on “New Group”.</p>
                    </div>
                    <div v-if="enrollment.get('taskGroups').length && !hasTasks" class="card card--padded card--tutorial">
                        <p>For each group, click on the <span title="“add a task”"><i class="far fa-plus"></i></span> button below to add tasks under it. For example, if there is a group called “Quiz” and there are 3 quizzes in total, then click on the <span title="“add a course”"><i class="far fa-plus"></i></span> button for 3 times.</p>
                    </div>
                    <div v-if="hasTasks" class="card card--padded card--tutorial">
                        <p>Repeat everything until you have the entire grading criteria reflected here. For the groups with tasks taking up different percentages, assign a percentage for each task by clicking on the <span title="“edit percentage”"><i class="far fa-edit"></i></span> icon.</p>
                        <p>If you have scores received, you can put them in now. Put your score into the box on the left and full score into the box on the right. It’s okay if you haven’t received any scores at this time. You can always come back later.</p>
                        <p>Don’t forget to add your other courses as well. You can go back to Dashboard at any time to view all the courses you’ve added.</p>
                        <p><b class="card--tutorial__button" @click="tutorial = false; AV.User.current().set('tutorial.dashboard', false).save();">Got It</b></p>
                    </div>
                </dd>
                <app-dashboard-view-task-group v-for="taskGroup in enrollment.get('taskGroups')" :taskGroup="taskGroup" :enrollment="enrollment"></app-dashboard-view-task-group>
                <dt id="app-dashboard__view__task-group__add" @click="add();">
                    <span>
                        <i class="far fa-plus"></i>
                    </span>
                    <span><b>New Group</b></span>
                </dt>
            </div>
            <div v-else>
                <dt>Loading…</dt>
            </div>
            <modal-wrapper v-if="adding">
                <dl class="cards">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <h1>New Group</h1>
                                <div class="field">
                                    <input type="checkbox" id="app-dashboard__view__task-group__editing__type" v-model="pendingChanges.isTest">
                                    <label for="app-dashboard__view__task-group__editing__type">Tasks Within This Group Are Exams</label>
                                </div>
                                <div class="field">
                                    <label for="app-dashboard__view__task-group__editing__name">What is the name of them?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__name" v-model="pendingChanges.name" :placeholder="pendingChanges.isTest ? 'Example: Quiz' : 'Example: Homework'">
                                </div>
                                <div class="field">
                                    <input type="checkbox" id="app-dashboard__view__task-group__editing__same-percentage" v-model="pendingChanges.samePercentage">
                                    <label for="app-dashboard__view__task-group__editing__same-percentage">All Tasks Take up the Same Percentage</label>
                                </div>
                                <div v-if="pendingChanges.samePercentage" class="field">
                                    <label for="app-dashboard__view__task-group__editing__percentage">What is the total percentage they take up?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__percentage" v-model="pendingChanges.percentage" placeholder="Example: 40">
                                </div>
                                <div v-if="pendingChanges.samePercentage" class="field">
                                    <label for="app-dashboard__view__task-group__editing__drop">How many lowest scores will be dropped?</label>
                                    <input type="text" id="app-dashboard__view__task-group__editing__drop" v-model="pendingChanges.drop" placeholder="Example: 1">
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="saveNewGroup();">
                                    <span>Done</span>
                                    <i class="far fa-check"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section>
                                <button @click="adding = false; store.commit('closeModal'); resetPendingChanges();">
                                    <span>Cancel</span>
                                    <i class="far fa-times"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </dl>
            </modal-wrapper>
        </dl>
    `,
    data: function () {
        return {
            tutorial: AV.User.current().get('tutorial').dashboard,
            loaded: false,
            enrollment: (new (AV.Object.extend('Enrollment'))).set('courseOffering', (new (AV.Object.extend('CourseOffering'))).set('course', (new (AV.Object.extend('Course'))))),
            adding: false,
            pendingChanges: {
                isTest: false,
                name: '',
                samePercentage: true,
                percentage: '',
                drop: ''
            }
        };
    },
    computed: {
        grade: function () {
            let vm = this;
            let earnedPercentage = 0;
            let coveredPercentage = 0;
            let uncompletedPercentage = 0;
            let fullPercentage = 100;
            for (let taskGroup of vm.enrollment.get('taskGroups')) {
                let tasksWithScores = [];
                for (let task of taskGroup.tasks) {
                    if (typeof task.myScore === 'number' && typeof task.totalScore === 'number') {
                        tasksWithScores.push({
                            percentage: task.percentage ? task.percentage : taskGroup.percentage / taskGroup.tasks.length,
                            myScore: task.myScore,
                            totalScore: task.totalScore
                        });
                    }
                    else {
                        uncompletedPercentage += task.percentage ? task.percentage : taskGroup.percentage / taskGroup.tasks.length;
                    }
                }
                if (taskGroup.drop) {
                    tasksWithScores.sort((a, b) => {
                        return b.myScore / b.totalScore - a.myScore / a.totalScore;
                    });
                    for (let i = 0; i < Math.min(taskGroup.drop, tasksWithScores.length - 1); i++) {
                        fullPercentage -= tasksWithScores.pop().percentage;
                    }
                }
                for (let taskWithScores of tasksWithScores) {
                    earnedPercentage += taskWithScores.percentage * taskWithScores.myScore / taskWithScores.totalScore;
                    coveredPercentage += taskWithScores.percentage;
                }
            }
            return { earnedPercentage, coveredPercentage, uncompletedPercentage, fullPercentage };
        },
        hasTasks: function () {
            let vm = this;
            for (taskGroup of vm.enrollment.get('taskGroups')) {
                if (taskGroup.tasks.length) {
                    return true;
                }
            }
        }
    },
    methods: {
        resetPendingChanges: function () {
            let vm = this;
            vm.pendingChanges = {
                isTest: false,
                name: '',
                samePercentage: true,
                percentage: '',
                drop: ''
            };
        },
        letterGrade: function (earnedPercentage, coveredPercentage, fullPercentage) {
            let vm = this;
            for (let grade of vm.enrollment.get('courseOffering').get('course').get('school').get('gradingStandard')) {
                if (earnedPercentage / Math.min(coveredPercentage, fullPercentage) >= grade.threshold) {
                    return {
                        letter: grade.letter,
                        markup: grade.markup || ''
                    };
                }
            }
        },
        add: function () {
            let vm = this;
            if (vm.enrollment.get('taskGroups').length >= 6) {
                alert('You can have at most 6 groups for each course.');
            }
            else {
                vm.resetPendingChanges();
                store.commit('openModal');
                vm.adding = true;
            }
        },
        saveNewGroup: function () {
            let vm = this;
            if (vm.enrollment.get('taskGroups').length >= 6) {
                alert('You can have at most 6 groups for each course.');
            }
            else if (!vm.pendingChanges.name) {
                alert('Please enter the name for the tasks.');
            }
            else if (vm.pendingChanges.samePercentage && !(parseFloat(vm.pendingChanges.percentage) >= 0)) {
                alert('Please enter the total percentage.');
            }
            else {
                vm.enrollment.get('taskGroups').push({
                    name: vm.pendingChanges.name,
                    percentage: vm.pendingChanges.samePercentage ? parseFloat(vm.pendingChanges.percentage) : null,
                    drop: vm.pendingChanges.samePercentage ? parseFloat(vm.pendingChanges.drop) || 0 : null,
                    isTest: vm.pendingChanges.isTest,
                    tasks: []
                });
                vm.enrollment.save().then(function () {
                    vm.adding = false;
                    store.commit('closeModal');
                    vm.resetPendingChanges();
                });
            }
        }
    },
    created: function () {
        let vm = this;
        let enrollmentQuery = new AV.Query('Enrollment');
        enrollmentQuery.include('courseOffering');
        enrollmentQuery.include('courseOffering.course');
        enrollmentQuery.include('courseOffering.course.school');
        enrollmentQuery.get(vm.$route.params.enrollment).then(function (enrollment) {
            vm.enrollment = enrollment;
            vm.loaded = true;
        });
    }
};
const AppDashboardAdd = {
    template: `
        <dl class="cards">
            <div v-if="loaded">
                <dd>
                    <div class="card">
                        <section class="fields">
                            <div class="field">
                                <label for="app-dashboard__add__school">School</label>
                                <select id="app-dashboard__add__school" v-model="school" @change="loadTerms();">
                                    <option :value="null" disabled>Select One</option>
                                    <option v-for="school in schools" :value="school">{{ school.get('name') }}</option>
                                </select>
                            </div>
                            <div class="field">
                                <label for="app-dashboard__add__term">Term</label>
                                <select id="app-dashboard__add__term" v-model="term">
                                    <option :value="null" disabled>Select One</option>
                                    <option v-for="term in terms" :value="term">{{ term.get('name') }}</option>
                                </select>
                            </div>
                            <div class="field">
                                <label for="app-dashboard__add__course-code">Course Code</label>
                                <input type="text" id="app-dashboard__add__course-code" v-focus v-model="courseCode" placeholder="Example: 36090" @keypress.enter="$event.target.blur(); search();">
                            </div>
                        </section>
                        <section>
                            <button class="primary" @click="search();">
                                <span>Search</span>
                                <i class="far fa-search"></i>
                            </button>
                        </section>
                    </div>
                </dd>
                <div v-if="searched">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <div class="field">
                                    <label for="app-dashboard__add__course-number">Course Number</label>
                                    <input type="text" id="app-dashboard__add__course-number" :value="courseOffering.get('course').get('number')" disabled>
                                </div>
                                <div class="field">
                                    <label for="app-dashboard__add__units">Units</label>
                                    <input type="text" id="app-dashboard__add__units" :value="courseOffering.get('units')" disabled>
                                </div>
                                <div class="field">
                                    <input type="checkbox" id="app-dashboard__add__counts-into-gpa" v-model="countsIntoGpa">
                                    <label for="app-dashboard__add__counts-into-gpa">Grade Counts into GPA</label>
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="done();">
                                    <span>Confirm</span>
                                    <i class="far fa-check"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </div>
            </div>
            <div v-else>
                <dt>Loading…</dt>
            </div>
        </dl>
    `,
    data: function () {
        return {
            loaded: false,
            schools: [],
            school: null,
            terms: [],
            term: null,
            courseCode: '',
            courseOffering: (new (AV.Object.extend('CourseOffering'))).set('course', (new (AV.Object.extend('Course')))),
            countsIntoGpa: true,
            searched: false
        };
    },
    methods: {
        loadTerms: function () {
            let vm = this;
            let termQuery = new AV.Query('Term');
            termQuery.equalTo('school', vm.school);
            termQuery.descending('startingAt');
            termQuery.limit(1000);
            termQuery.find().then(function (terms) {
                vm.terms = terms;
                if (vm.terms.length) {
                    vm.term = vm.terms[0];
                }
                vm.loaded = true;
            });
        },
        search: function () {
            let vm = this;
            let courseOfferingQuery = new AV.Query('CourseOffering');
            courseOfferingQuery.equalTo('term', vm.term);
            courseOfferingQuery.equalTo('code', vm.courseCode);
            courseOfferingQuery.include('course');
            courseOfferingQuery.limit(1000);
            courseOfferingQuery.find().then(function (courseOffering) {
                if (!courseOffering.length) {
                    alert('Sorry, we did not find any courses that match the course code you entered.');
                }
                else {
                    vm.courseOffering = courseOffering[0];
                    vm.searched = true;
                }
            });
        },
        done: function () {
            let vm = this;
            let Enrollment = AV.Object.extend('Enrollment');
            let enrollment = new Enrollment();
            enrollment.set('courseOffering', vm.courseOffering);
            enrollment.set('countsIntoGpa', vm.countsIntoGpa);
            enrollment.save().then(function (enrollment) {
                router.push('/dashboard/view/' + enrollment.id);
            });
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    },
    created: function () {
        let vm = this;
        let schoolQuery = new AV.Query('School');
        schoolQuery.limit(1000);
        schoolQuery.find().then(function (schools) {
            vm.schools = schools;
            for (school of vm.schools) {
                if (school.id === AV.User.current().get('school').id) {
                    vm.school = school;
                }
            }
            vm.loadTerms();
        });
    }
};
const AppDashboard = {
    template: `
        <div id="app-dashboard" class="app">
            <router-view></router-view>
        </div>
    `
};
const AppTasksTask = {
    template: `
        <div class="card app-tasks__task">
            <div class="app-tasks__task__complete" :title="task.taskGroup.isTest ? 'Mark as reviewed and dismiss.' : 'Mark as completed.'" @click="task.task.completed = true; task.enrollment.save();">
                <i :class="['far', task.taskGroup.isTest ? 'fa-smile' : 'fa-check']"></i>
            </div>
            <div class="app-tasks__task__main" @click="router.push('/dashboard/view/' + task.enrollment.id);">
                <div>
                    <h2>
                        <span>{{ task.taskGroup.name }}{{ task.taskGroup.tasks.length === 1 ? '' : ' ' + (task.taskGroup.tasks.indexOf(task.task) + 1) }}</span>
                        <span :class="['button-icon', task.task.pinned ? 'button-icon--on' : '']" :title="task.task.pinned ? 'Pinned to the top. Click to unpin.' : 'Pin to the top.'" @click.stop="task.task.pinned = !task.task.pinned; task.enrollment.save();">
                            <i :class="[task.task.pinned ? 'fas' : 'far', 'fa-thumbtack']"></i>
                        </span>
                    </h2>
                    <p><b>{{ task.enrollment.get('courseOffering').get('course').get('number') }}</b></p>
                </div>
                <div class="app-tasks__task__main__right">
                    <h2>
                        <span :class="['app-tasks__task__countdown', task.task.due > new Date() ? '' : 'app-tasks__task__countdown--overdue']">{{ Math.abs(task.task.due - new Date()) >= 259200000 ? Math.floor(Math.abs((task.task.due - new Date()) / 86400000)) + ' days' : Math.abs(task.task.due - new Date()) >= 7200000 ? Math.floor(Math.abs((task.task.due - new Date()) / 3600000)) + ' hours' : Math.abs(task.task.due - new Date()) >= 120000 ? Math.floor(Math.abs((task.task.due - new Date()) / 60000)) + ' minutes' : Math.abs(task.task.due - new Date()) >= 60000 ? '1 minute' : 'Less than 1 minute' }} {{ task.task.due > new Date() ? 'left' : 'overdue' }}</span>
                    </h2>
                    <p><b>{{ task.taskGroup.isTest ? 'At' : 'Due' }} {{ flatpickr.formatDate(task.task.due, 'n/j h:iK') }}</b></p>
                </div>
            </div>
        </div>
    `,
    props: {
        task: Object
    }
};
const AppTasks = {
    components: {
        'app-tasks-task': AppTasksTask
    },
    template: `
        <div id="app-tasks" class="app">
            <dl class="cards">
                <div v-if="loaded">
                    <dd v-if="tutorial">
                        <div class="card card--padded card--tutorial">
                            <p>Tasks with due dates or exam dates assigned will show up here. To assign date to a task, click on the <span title="“edit date”"><i class="far fa-calendar-edit"></i></span> icon within it.</p>
                            <p><b class="card--tutorial__button" @click="tutorial = false; AV.User.current().set('tutorial.tasks', false).save();">Got It</b></p>
                        </div>
                    </dd>
                    <dt v-if="!tasks.length">No Uncompleted Dated Task at This Moment</dt>
                    <dt v-if="tasks.filter(task => task.task.pinned).length">Pinned</dt>
                    <dd>
                        <app-tasks-task v-for="task in tasks.filter(task => task.task.pinned)" :task="task"></app-tasks-task>
                    </dd>
                    <dt v-if="tasks.filter(task => task.task.pinned).length && tasks.filter(task => !task.task.pinned).length > 0">Others</dt>
                    <dd>
                        <app-tasks-task v-for="task in tasks.filter(task => !task.task.pinned)" :task="task"></app-tasks-task>
                    </dd>
                </div>
                <div v-else>
                    <dt>Loading…</dt>
                </div>
            </dl>
        </div>
    `,
    data: function () {
        return {
            tutorial: AV.User.current().get('tutorial').tasks,
            loaded: false,
            enrollments: []
        };
    },
    computed: {
        presentEnrollments: function () {
            let vm = this;
            return vm.enrollments.filter(enrollment => enrollment.get('courseOffering').get('term').get('startingAt') <= new Date() && enrollment.get('courseOffering').get('term').get('endingAt') >= new Date());
        },
        tasks: function () {
            let vm = this;
            let r = [];
            for (let presentEnrollment of vm.presentEnrollments) {
                for (let taskGroup of presentEnrollment.get('taskGroups')) {
                    for (let task of taskGroup.tasks) {
                        if (task.due && !task.completed && !(taskGroup.isTest && task.due < new Date())) {
                            r.push({
                                enrollment: presentEnrollment,
                                taskGroup: taskGroup,
                                task: task
                            });
                        }
                    }
                }
            }
            r.sort((a, b) => {
                return a.task.due - b.task.due;
            });
            return r;
        }
    },
    created: function () {
        let vm = this;
        let enrollmentQuery = new AV.Query('Enrollment');
        enrollmentQuery.equalTo('user', AV.User.current());
        enrollmentQuery.include('courseOffering');
        enrollmentQuery.include('courseOffering.term');
        enrollmentQuery.include('courseOffering.course');
        enrollmentQuery.limit(1000);
        enrollmentQuery.find().then(function (enrollments) {
            vm.enrollments = enrollments;
            vm.loaded = true;
        });
        enrollmentQuery.subscribe().then(function (liveQuery) {
            liveQuery.on('create', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('update', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('enter', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('leave', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
            liveQuery.on('delete', function () {
                enrollmentQuery.find().then(function (enrollments) {
                    vm.enrollments = enrollments;
                });
            });
        });
    }
};
const AppSettings = {
    components: {
        'modal-wrapper': ModalWrapper
    },
    template: `
        <div id="app-settings" class="app">
            <dl class="cards">
                <div v-if="loaded">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <div class="field field--half">
                                    <label for="app-settings__profile__first-name">First Name</label>
                                    <input type="text" id="app-settings__profile__first-name" :value="AV.User.current().get('firstName')" @input="AV.User.current().set('firstName', $event.target.value)" @keypress.enter="$event.target.blur(); saveChanges();">
                                </div>
                                <div class="field field--half">
                                    <label for="app-settings__profile__last-name">Last Name</label>
                                    <input type="text" id="app-settings__profile__last-name" :value="AV.User.current().get('lastName')" @input="AV.User.current().set('lastName', $event.target.value)" @keypress.enter="$event.target.blur(); saveChanges();">
                                </div>
                                <div class="field field--half">
                                    <label v-if="AV.User.current().get('emailVerified')" for="app-settings__profile__email">Email</label>
                                    <label v-else for="app-settings__profile__email" class="app-settings__profile__attention" @click="requestEmailVerify();">Email · Resend Verification Email</label>
                                    <input type="email" id="app-settings__profile__email" :value="AV.User.current().get('email')" @input="AV.User.current().set('email', $event.target.value).set('username', $event.target.value);" @keypress.enter="$event.target.blur(); saveChanges();">
                                </div>
                                <div class="field field--half">
                                    <label for="app-settings__profile__school">School</label>
                                    <select id="app-settings__profile__school" v-model="school">
                                        <option :value="null" disabled>Select One</option>
                                        <option v-for="school in schools" :value="school">{{ school.get('name') }}</option>
                                    </select>
                                </div>
                                <div class="field field--half">
                                    <label for="app-settings__profile__major">Major</label>
                                    <input type="text" id="app-settings__profile__major" :value="AV.User.current().get('major')" @input="AV.User.current().set('major', $event.target.value)" @keypress.enter="$event.target.blur(); saveChanges();">
                                </div>
                                <div class="field field--half">
                                    <label for="app-settings__profile__year-of-graduation">Year of Graduation</label>
                                    <input type="text" id="app-settings__profile__year-of-graduation" :value="AV.User.current().get('yearOfGraduation')" @input="AV.User.current().set('yearOfGraduation', $event.target.value)" @keypress.enter="$event.target.blur(); saveChanges();">
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="saveChanges();">
                                    <span>Save Changes</span>
                                    <i class="far fa-check"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <div class="field">
                                    <input type="checkbox" id="app-settings__marketing-email" :checked="AV.User.current().get('marketingEmail')" @change="AV.User.current().set('marketingEmail', $event.target.checked); AV.User.current().save();">
                                    <label for="app-settings__marketing-email">Marketing Email</label>
                                </div>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section>
                                <button @click="resetPendingChanges(); store.commit('openModal'); changingPassword = true;">
                                    <span>Change Password</span>
                                    <i class="far fa-key"></i>
                                </button>
                            </section>
                            <section>
                                <button @click="logOut();">
                                    <span>Log out</span>
                                    <i class="far fa-sign-out"></i>
                                </button>
                            </section>
                            <section>
                                <button @click="deleteAccount();">
                                    <span>Delete Account</span>
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </div>
                <div v-else>
                    <dt>Loading…</dt>
                </div>
            </dl>
            <modal-wrapper v-if="changingPassword">
                <dl class="cards">
                    <dd>
                        <div class="card">
                            <section class="fields">
                                <h1>Change Password</h1>
                                <div class="field">
                                    <label for="app-settings__changeing-password">New Password</label>
                                    <input type="text" id="app-settings__changeing-password" v-focus v-model="pendingChanges.password" @keypress.enter="$event.target.blur(); savePassword();">
                                </div>
                            </section>
                            <section>
                                <button class="primary" @click="savePassword();">
                                    <span>Continue</span>
                                    <i class="far fa-arrow-right"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                    <dd>
                        <div class="card">
                            <section>
                                <button @click="changingPassword = false; store.commit('closeModal'); resetPendingChanges();">
                                    <span>Cancel</span>
                                    <i class="far fa-times"></i>
                                </button>
                            </section>
                        </div>
                    </dd>
                </dl>
            </modal-wrapper>
        </div>
    `,
    data: function () {
        return {
            loaded: false,
            schools: [],
            school: null,
            changingPassword: false,
            pendingChanges: {
                password: ''
            }
        };
    },
    methods: {
        resetPendingChanges: function () {
            let vm = this;
            vm.pendingChanges = {
                password: ''
            };
        },
        requestEmailVerify: function () {
            let vm = this;
            AV.User.requestEmailVerify(AV.User.current().get('email')).then(function () {
                alert('An email has been sent to your inbox with further instructions.');
            }, function (error) {
                if (error.code === 1) {
                    alert('You have made too many requests in a short period of time. Please try again later.');
                }
                else {
                    alert('An unknown error has occurred. Please let our staff know about this and we will be happy to help you out!');
                }
            });
        },
        saveChanges: function () {
            let vm = this;
            if (!AV.User.current().get('email')) {
                alert('Please enter your email address.');
            }
            else if (!vm.school) {
                alert('Please select the school you are in.');
            }
            else {
                AV.User.current().save().then(function () {
                    alert('Profile saved. Thank you for the updates!');
                }, function (error) {
                    if (error.code === 125) {
                        alert('The email address you entered is not a valid one. Please check your input.');
                    }
                    else if (error.code === 202) {
                        alert('The email address you entered is already used for another account.')
                    }
                    else {
                        alert('An unknown error has occurred. Please let our staff know about this and we will be happy to help you out!');
                    }
                });
            }
        },
        savePassword: function () {
            let vm = this;
            if (vm.pendingChanges.password.length < 6) {
                alert('Your password must be at least 6 digits.');
            }
            else {
                AV.User.current().set('password', vm.pendingChanges.password).save().then(function () {
                    AV.User.logIn(AV.User.current().get('email'), vm.pendingChanges.password).then(function () {
                        alert('Your password has been changed!');
                        vm.changingPassword = false;
                        store.commit('closeModal');
                        vm.resetPendingChanges();
                    });
                });
            }
        },
        logOut: function () {
            AV.User.logOut().then(function () {
                location.href = '/';
            });
        },
        deleteAccount: function () {
            let vm = this;
            if (confirm('Everything in this account will be completely erased and cannot be recovered. Are you sure to continue?')) {
                let emailEntered = prompt('Confirm your email address:');
                if (emailEntered !== null) {
                    if (emailEntered === AV.User.current().get('email')) {
                        AV.User.current().destroy().then(
                            function () {
                                alert('Your account has been deleted. Thank you for using GPA.IO!');
                                vm.logOut();
                            }
                        );
                    }
                    else {
                        alert('The email you entered is not the one you are using for this account.');
                    }
                }
            }
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    },
    created: function () {
        let vm = this;
        AV.User.current().fetch().then(function () {
            AV.User.current().get('school').fetch().then(function () {
                let schoolQuery = new AV.Query('School');
                schoolQuery.limit(1000);
                schoolQuery.find().then(function (schools) {
                    vm.schools = schools;
                    for (school of vm.schools) {
                        if (school.id === AV.User.current().get('school').id) {
                            vm.school = school;
                        }
                    }
                    vm.loaded = true;
                });
            });
        });
    }
};
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/dashboard',
            component: AppDashboard,
            children: [
                {
                    path: '',
                    component: AppDashboardHome
                },
                {
                    path: 'view/:enrollment',
                    component: AppDashboardView
                },
                {
                    path: 'add',
                    component: AppDashboardAdd
                }
            ]
        },
        {
            path: '/tasks',
            component: AppTasks
        },
        {
            path: '/settings',
            component: AppSettings
        }
    ]
});
const store = new Vuex.Store({
    state: {
        modalOn: false
    },
    mutations: {
        openModal(state) {
            state.modalOn = true;
        },
        closeModal(state) {
            state.modalOn = false;
        }
    }
});
Promise.resolve(AV.User.current()).then(user => user ? user.isAuthenticated().then(authenticated => authenticated ? user : null) : null).then(user => {
    if (user) {
        AV.User.current().fetch().then(function () {
            new Vue({
                el: '#main',
                template: `
                    <div>
                        <aside :class="[asideOn ? 'on' : '']">
                            <div id="gpa-window">
                                <p v-if="loaded" id="gpa-window__number" :class="[gpaOfThisTerm ? 'on' : '']">{{ gpaOfThisTerm ? gpaOfThisTerm : '0.00' }}</p>
                                <p v-if="loaded" id="gpa-window__description"><b>{{ gpaOfThisTerm ? 'GPA of this term' : 'An estimated GPA will show up here once you start putting in your scores' }}</b></p>
                            </div>
                            <ul id="app-list">
                                <li v-for="app in apps" :class="[$route.path.startsWith(app.path) ? 'active' : '']" @click="router.push(app.path); asideOn = false;">
                                    <i :class="['fas', app.icon]"></i>
                                    <span>{{ app.name }}</span>
                                </li>
                            </ul>
                            <div id="menu-toggle" title="Menu." @click="asideOn = !asideOn;">
                                <i class="fas fa-bars"></i>
                            </div>
                        </aside>
                        <div id="current-app-wrapper" :style="{ overflowY: store.state.modalOn ? 'hidden' : 'scroll' }">
                            <router-view></router-view>
                        </div>
                    </div>
                `,
                data: function () {
                    return {
                        loaded: false,
                        asideOn: false,
                        enrollments: [],
                        apps: [
                            {
                                icon: 'fa-tachometer-alt',
                                name: 'Dashboard',
                                path: '/dashboard'
                            },
                            {
                                icon: 'fa-clipboard-list',
                                name: 'Tasks',
                                path: '/tasks'
                            },
                            {
                                icon: 'fa-cog',
                                name: 'Settings',
                                path: '/settings'
                            }
                        ]
                    };
                },
                computed: {
                    presentEnrollments: function () {
                        let vm = this;
                        return vm.enrollments.filter(enrollment => enrollment.get('courseOffering').get('term').get('startingAt') <= new Date() && enrollment.get('courseOffering').get('term').get('endingAt') >= new Date());
                    },
                    gpaOfThisTerm: function () {
                        let vm = this;
                        let totalGradePoints = 0;
                        let totalUnits = 0;
                        for (let presentEnrollment of vm.presentEnrollments) {
                            let earnedPercentage = 0;
                            let coveredPercentage = 0;
                            let fullPercentage = 100;
                            for (let taskGroup of presentEnrollment.get('taskGroups')) {
                                let tasksWithScores = [];
                                for (let task of taskGroup.tasks) {
                                    if (typeof task.myScore === 'number' && typeof task.totalScore === 'number') {
                                        tasksWithScores.push({
                                            percentage: task.percentage ? task.percentage : taskGroup.percentage / taskGroup.tasks.length,
                                            myScore: task.myScore,
                                            totalScore: task.totalScore
                                        });
                                    }
                                }
                                if (taskGroup.drop) {
                                    tasksWithScores.sort((a, b) => {
                                        return b.myScore / b.totalScore - a.myScore / a.totalScore;
                                    });
                                    for (let i = 0; i < Math.min(taskGroup.drop, tasksWithScores.length - 1); i++) {
                                        fullPercentage -= tasksWithScores.pop().percentage;
                                    }
                                }
                                for (let taskWithScores of tasksWithScores) {
                                    earnedPercentage += taskWithScores.percentage * taskWithScores.myScore / taskWithScores.totalScore;
                                    coveredPercentage += taskWithScores.percentage;
                                }
                            }
                            if (coveredPercentage) {
                                for (let grade of presentEnrollment.get('courseOffering').get('course').get('school').get('gradingStandard')) {
                                    if (earnedPercentage / Math.min(coveredPercentage, fullPercentage) >= grade.threshold) {
                                        totalGradePoints += grade.gradePoints * presentEnrollment.get('courseOffering').get('units');
                                        totalUnits += presentEnrollment.get('courseOffering').get('units');
                                        break;
                                    }
                                }
                            }
                        }
                        return totalUnits ? (totalGradePoints / totalUnits).toFixed(2) : null;
                    }
                },
                created: function () {
                    let vm = this;
                    let enrollmentQuery = new AV.Query('Enrollment');
                    enrollmentQuery.equalTo('user', AV.User.current());
                    enrollmentQuery.equalTo('countsIntoGpa', true);
                    enrollmentQuery.include('courseOffering');
                    enrollmentQuery.include('courseOffering.term');
                    enrollmentQuery.include('courseOffering.course');
                    enrollmentQuery.include('courseOffering.course.school');
                    enrollmentQuery.limit(1000);
                    enrollmentQuery.find().then(function (enrollments) {
                        vm.enrollments = enrollments;
                        vm.loaded = true;
                    });
                    enrollmentQuery.subscribe().then(function (liveQuery) {
                        liveQuery.on('create', function () {
                            enrollmentQuery.find().then(function (enrollments) {
                                vm.enrollments = enrollments;
                            });
                        });
                        liveQuery.on('update', function () {
                            enrollmentQuery.find().then(function (enrollments) {
                                vm.enrollments = enrollments;
                            });
                        });
                        liveQuery.on('enter', function () {
                            enrollmentQuery.find().then(function (enrollments) {
                                vm.enrollments = enrollments;
                            });
                        });
                        liveQuery.on('leave', function () {
                            enrollmentQuery.find().then(function (enrollments) {
                                vm.enrollments = enrollments;
                            });
                        });
                        liveQuery.on('delete', function () {
                            enrollmentQuery.find().then(function (enrollments) {
                                vm.enrollments = enrollments;
                            });
                        });
                    });
                },
                router
            });
        });
    }
    else {
        location.href = '/auth';
    }
});