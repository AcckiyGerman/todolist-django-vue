var projectsColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projects-column',
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
                console.log('get data from server: ', data);
                self.projectsList = data;
            })
        },
        editProject: function (data) {
            console.log(data);
            this.projectsList[data].edit=true
        },
        deleteProject: function () {

        }
    }
});

var tasksColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#tasks-column',
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
                console.log('get data from server: ', data);
                self.tasksList = data;
            })
        }
    }
});