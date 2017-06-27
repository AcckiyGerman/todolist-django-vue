// sessions CSRF setup for secure ajax POST request
var csrf_token = $("[name=csrfmiddlewaretoken]").val();
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrf_token);
        }
    }
});

var projectsColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projects-column',
    data : {
        projectsList: [],
        newProject: {name: '', colour: 'blue', edit: false},
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
            $.ajax({type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                url: "/add_project/",
                data: JSON.stringify(self.newProject),

                success: function(project){
                    console.log('successfully uploaded new project:', project);
                    project.edit = false;
                    self.projectsList.push(project);
                    self.newProject.name = '';
                    self.newProject.edit = false;
                },
                failure: function(errMsg) {
                    alert(errMsg);
                }
            });
        },
        saveProject: function (project) {
            // send edited data to server
            project.edit=!project.edit;
        },
        deleteProject: function (project) {
            console.log('trying to delete project:', project.name)
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