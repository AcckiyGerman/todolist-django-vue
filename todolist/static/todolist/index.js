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
                // project.edit - when true - will show project edit form (using vue v-if)
                projects.forEach(function(project){ project.edit = false });
                self.projectsList = projects;
            })
        },
        newProjectInputHandler: function (event) {
            if (event.key == 'Enter'){ this.addProject() }
            if (event.key == 'Escape') { this.newProject.edit = false }
        },
        addProject: function () {
            var self = this;
            this.jsonToServer('/add_project/', this.newProject, function(project){
                console.log('successfully uploaded new project:', project);
                project.edit = false;  // add 'edit' field, need to vue v-bind proper work
                self.projectsList.push(project);
                self.newProject.name = '';
                self.newProject.edit = false;
            })
        },
        updateProject: function (project) {
            // send edited data to server
            this.jsonToServer('/update_project/', project, function(response){
                console.log('server reply:', response);
                project.edit=!project.edit;
            });


        },
        deleteProject: function (project) {
            console.log('trying to delete project:', project.name);
            this.jsonToServer('/delete_project/', project.id, function(response) {
                console.log('server reply:', response);
            });
            this.fetchProjectsList();
        },
        jsonToServer: function (address, data, successFunction) {
            $.ajax({type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                url: address,
                data: JSON.stringify(data),
                success: successFunction,
                error: function(errMsg) {
                    alert(errMsg.responseText);
                }
            })
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