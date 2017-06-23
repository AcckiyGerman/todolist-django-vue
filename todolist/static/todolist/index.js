var projectsView = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projectsView',
    data : {
        projectsList: []
    },
    mounted: function () {
        this.fetchProjectsList();
    },
    methods: {
        fetchProjectsList: function () {
            var self = this;
            $.getJSON('/projects_list/', {'key':'value'}, function (data) {
                console.log(data);
                self.projectsList = data;
            })
        }
    }
});

var tasksView = new Vue({
    delimiters: ['[[', ']]'],
    el: '#tasksView',
    data : {
        tasksList: []
    },
    mounted: function () {
        this.fetchTasksList();
    },
    methods: {
        fetchTasksList: function () {
            var self = this;
            $.getJSON('/tasks_list/', {'key':'value'}, function (data) {
                console.log(data);
                self.tasksList = data;
            })
        }
    }
});