var projectsColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projects-column',
    data : {
        projectsList: [],
        newProject: {
            edit: false,
            name: '',
            colour: 'yellow'
        },
        colors: ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'violet', 'white']
    },
    mounted: function () {
        this.fetchProjectsList();
    },
    methods: {
        fetchProjectsList: function () {
            var self = this;
            $.getJSON('/projects_list/', {'key':'value'}, function (projects) {
                console.log('Got projects list from server: ', projects);
                console.log('Adding "edit=false" flag to each project.');
                // project.edit - boolean flag, showing if the project is in edit state.
                projects.forEach(function(project){ project.edit = false });
                self.projectsList = projects;
            })
        },
        addProject: function () {
            var self = this;
            $.ajax('/add_project/')
        },
        saveProject: function (project) {
            // send edited data to server
            project.edit=!project.edit;
        },
        deleteProject: function (project) {
            alert('user wants to delete project')
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