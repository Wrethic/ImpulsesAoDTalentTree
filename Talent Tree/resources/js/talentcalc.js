$(document).ready(function() {
    var addclass = 'color';
    var $cols = $('.aod-talent-tree-talent-inner').click(function(e) {
        $cols.removeClass(addclass);
        $(this).addClass(addclass);
    });
    var talents  = document.getElementsByClassName('aod-talent-tree-talent');
    var images_urls = [];
    var images_names = [];
    var tmp;
    for(var i=0;i < talents.length;i++){
      images_urls[i] = talents[i].getAttribute("href"); 
      tmp = talents[i].getAttribute('src').split('/');
      images_names[i] = tmp[tmp.length -1].split['.'][0];
    }

    console.log(talents); // ["imageOne", "imageTwo", "imageThree"]

});

$('.aod-talent-tree-talent').hover(function () {
    $('#slayer').stop().fadeIn();
}, function () {
    $('#slayer').stop().fadeOut();
});