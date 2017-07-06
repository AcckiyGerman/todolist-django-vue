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
                    if (errMsg.responseText) alert(errMsg.responseText);
                    else alert('Server not responding.')
                }
            })
        }
function parseDate(date){
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1))
        .slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
};

var vue = new Vue({
    delimiters: ['[[', ']]'],
    el: '#todolist_spa',
    data : {
        projectsList: [],
        highlightedProject: 'all',
        newProject: {name: '', colour: 'blue', edit: false},
        colors: ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'violet', 'white'],
        tasksList: [],
        newTask: {name: '', project_id: 0, priority: 'orange', finish_date: '', finished: false, edit: false},
        priorities: ['red', 'orange', 'white'],
        showFinishedTasks: false,
        todayDate: '',
        dateFilter: 'today'
    },
    mounted: function () {
        this.fetchProjectsList();
        this.fetchTasksList();
        this.initDate();
    },
    methods: {
        fetchProjectsList: function (filter) {
            var self = this;
            jsonToServer('/projects_list/', {filter: filter}, function (projects) {
                console.log('Got projects list from server: ', projects);
                console.log('Adding "edit=false" flag to each project.');
                self.projectsList = []; // clear projects list
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
            var self = this;
            console.log('trying to delete project:', project.name);
            jsonToServer('/delete_project/', project.id, function(response) {
                console.log('server reply:', response);
                setTimeout(self.fetchProjectsList(), 100);
                setTimeout(self.fetchTasksList(), 100);
            });
        },
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
        },
        updateTask: function (task) {
            console.log('try to update task:', task);
            jsonToServer('/update_task/', task, function(response){
                console.log('server reply:', response);
                task.edit=false;
            });
        },
        deleteTask: function (task) {
            console.log('trying to delete task:', task.name);
            jsonToServer('/delete_task/', task.id, function(response) {
                console.log('server reply:', response);
            });
            this.fetchTasksList();
        },
        initDate: function () {
            // fills newTask date for example
            // need for Mozilla because it not fully supports html5 <input type=date>
            this.todayDate = this.newTask.finish_date = parseDate(new Date)
        },
        reorderTasks : function(tasks) {
            return tasks
        },
        filterTask: function(task){
            // filter by date:
            var date = new Date;
            var today = parseDate(date);
            date.setDate(date.getDate() + 7); // add 7 days from today
            var todayPlus7 = parseDate(date);
            // date conditions:
            var dateFilter = (this.dateFilter == 'today' && task.finish_date == today) ||
                (this.dateFilter == 'sevenDays' && task.finish_date < todayPlus7 && task.finish_date >= today) ||
                this.dateFilter == 'all' || task.deadline;
            // task finished conditions:
            var finishedFilter = (!task.finished || this.showFinishedTasks) &&
                (this.highlightedProject == 'all' || task.project_id == this.highlightedProject);

            return dateFilter && finishedFilter
        }
    },
    computed: {
        reorderedTasks: function() {
            var tasks = this.tasksList;
            var self = this;
            // mark missed deadlines
            tasks.forEach(function (task) {
                if ( !task.finished && task.finish_date < self.todayDate ) { task.deadline = true }
                else { task.deadline = false }
            });
            return tasks.sort(function (taskA, taskB) {
                // sort by deadline
                if (taskA.deadline > taskB.deadline){ return -1 }
                if (taskA.deadline < taskB.deadline){ return 1 }
                // finished lower then unfinished:
                if (!taskA.finished && taskB.finished){ return -1 }
                if (taskA.finished && !taskB.finished){ return 1 }
                // sort by priority
                var P = {red: 10, orange: 5, white: 1};
                return P[taskA.priority] < P[taskB.priority];
            })
        }
    }
});
