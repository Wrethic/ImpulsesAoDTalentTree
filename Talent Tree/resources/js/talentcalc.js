var talents  = document.getElementsByClassName('aod-talent-tree-talent');
var talent_points = ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
var talent_points_max = ["5","5","5","5","5","5","5","5","5","1","5","5","5","1","3","5","1","1","1","1","1","1","1","1","3","1","1","3","1","1","1","1","1","1","3","1","5","1","2","1","1","5","1","1"];
var soul_level = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var total_max_points = 0;

$(document).ready(function() {
    var point_display = document.getElementsByClassName('aod-talent-tree-talent-points');
    total_max_points = soul_level.reduce((accumulator, current) => accumulator + current);
    var max_points = document.getElementById('points-max').textContent = "Total Maximum Points: "+total_max_points.toString();
    var remaining_points = document.getElementById('points-left').textContent = "Total Remaining Points: "+total_max_points.toString();
    for(var i=0;i < talents.length;i++){
        point_display[i] = point_display[i].textContent = talent_points[i] + "/" + talent_points_max[i];
    }
    var addclass = 'color';
    var $cols = $('.aod-talent-tree-talent').click(function(e) {
        $cols.removeClass(addclass);
        $(this).addClass(addclass);
});


});

$('.aod-talent-tree-talent').hover(function () {
    $('#slayer1').stop().fadeIn();
}, function () {
    $('#slayer1').stop().fadeOut();

    console.log(talents); // ["imageOne", "imageTwo", "imageThree"]
});

$('input').click(function(){
    var soul_value;
    var soul_point = this.getAttribute('data-point')-1;
    if($(this).context.checked == false){
        soul_value = 0;   
    }
    else {
        soul_value = 1;
    }
    soul_level[soul_point] = soul_value
    total_max_points = soul_level.reduce((accumulator, current) => accumulator + current);
    var max_points = document.getElementById('points-max').textContent = "Total Maximum Points: "+total_max_points.toString();
    var remaining_points = document.getElementById('points-left').textContent = "Total Remaining Points: "+total_max_points.toString();
    console.log(soul_level);
});

function listQ(){
    var x = 26;
    var e = Number($(this).val());
    console.log($(this).val());
    soul_level[x] = e;
    console.log(soul_level);
    total_max_points = soul_level.reduce((accumulator, current) => accumulator + current);
    var max_points = document.getElementById('points-max').textContent = "Total Maximum Points: "+total_max_points.toString();
    var remaining_points = document.getElementById('points-left').textContent = "Total Remaining Points: "+total_max_points.toString();
}
/* $("#list").on("change",listQ); */
document.getElementById("rebirth").onchange = listQ;
