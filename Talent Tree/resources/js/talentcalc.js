var talents  = document.getElementsByClassName('aod-talent-tree-talent');

$(document).ready(function() {
    var addclass = 'color';
    var $cols = $('.aod-talent-tree-talent').click(function(e) {
        $cols.removeClass(addclass);
        $(this).addClass(addclass);
    });
    var images_urls = [];
    var images_names = [];
    var talent_points = [];
    var tmp;
    for(var i=0;i < talents.length;i++){

    }

});

$('.aod-talent-tree-talent').hover(function () {
    $('#slayer1').stop().fadeIn();
}, function () {
    $('#slayer1').stop().fadeOut();

    console.log(talents); // ["imageOne", "imageTwo", "imageThree"]
});