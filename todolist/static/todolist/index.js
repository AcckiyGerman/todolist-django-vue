var projectsView = new Vue({
    delimiters: ['[[', ']]'],
    el: '#projectsView',
    data : {
        projectsList: [
            { name: '1-st project'},
            { name: '2-nd project'}
        ]
    }
});