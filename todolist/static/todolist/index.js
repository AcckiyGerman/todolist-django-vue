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
function jsonToServer(address, data, successFunction) {
            $.ajax({type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                url: address,
                data: JSON.stringify(data),
                success: successFunction,
                error: function(errMsg) {
                    alert(errMsg.responseText);
                }
            })
        }

// Shared list of Projects:
const globalProjectsList = [];

var projectsColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projects-column',
    data : {
        projectsList: globalProjectsList,
        newProject: {name: '', colour: 'blue', edit: false},
        colors: ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'violet', 'white']
    },
    mounted: function () {
        this.fetchProjectsList();
    },
    methods: {
        fetchProjectsList: function (filter) {
            var self = this;
            jsonToServer('/projects_list/', {filter: filter}, function (projects) {
                console.log('Got projects list from server: ', projects);
                console.log('Adding "edit=false" flag to each project.');
                self.projectsList.length = 0; // clear projects list
                projects.forEach(function(project){
                    // project.edit - when true - will show project edit form (using vue v-if)
                    project.edit = false;
                    self.projectsList.push(project)
                });
            })
        },
        newProjectInputHandler: function (event) {
            if (event.key == 'Enter'){ this.addProject() }
            if (event.key == 'Escape') { this.newProject.edit = false }
        },
        addProject: function () {
            var self = this;
            jsonToServer('/add_project/', this.newProject, function(project){
                console.log('successfully uploaded new project:', project);
                project.edit = false;  // add 'edit' field, need to vue v-bind proper work
                self.projectsList.push(project);
                self.newProject.name = '';
                self.newProject.edit = false;
            })
        },
        updateProject: function (project) {
            // send edited data to server
            jsonToServer('/update_project/', project, function(response){
                console.log('server reply:', response);
                project.edit=!project.edit;
            });


        },
        deleteProject: function (project) {
            console.log('trying to delete project:', project.name);
            jsonToServer('/delete_project/', project.id, function(response) {
                console.log('server reply:', response);
            });
            this.fetchProjectsList();
        }
    }
});

var tasksColumn = new Vue({
    delimiters: ['[[', ']]'],
    el: '#tasks-column',
    data : {
        tasksList: [],
        newTask: {name: '', project_id: 0, priority: 'white', finish_date: '', edit: false},
        priorities: ['red', 'orange', 'white'],
        projectsList: globalProjectsList
    },
    mounted: function () {
        this.fetchTasksList();
    },
    methods: {
        fetchTasksList: function (filter) {
            var self = this;
            jsonToServer('/tasks_list/', {filter: filter}, function (tasks) {
                console.log('get tasks list from server: ', tasks);
                // task.edit - when true - will show project edit form (using vue v-if)
                tasks.forEach(function(task){ task.edit = false });
                self.tasksList = tasks;
            })
        },
        addTask: function () {
            console.log("trying to add task:", this.newTask);
            var self = this;
            jsonToServer('/add_task/', this.newTask, function (task){
                console.log('Success:', task);
                task.edit = false;
                self.tasksList.push(task);
                self.newTask.edit = false;
            })
        }
    }
});