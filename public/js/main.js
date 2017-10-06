$(document).ready(() => {
    $('.button-collapse').sideNav();
    $('select').material_select();
});

if (document.querySelector('textarea')) {
    CKEDITOR.replace('body', {
        plugins: 'wysiwygarea,toolbar,basicstyles,link'
    });
}
