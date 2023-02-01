$(document).ready(function() {
    var addclass = 'color';
    var $cols = $('.aod-talent-tree-talent-inner').click(function(e) {
        $cols.removeClass(addclass);
        $(this).addClass(addclass);
    });
});