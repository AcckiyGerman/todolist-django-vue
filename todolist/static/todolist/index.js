var app = new Vue({
    // Do not fight with Django for tags
    delimiters: ['[[', ']]'],
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});