var talents  = document.getElementsByClassName('aod-talent-tree-talent');
var talent_points = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var talent_points_max = [5,5,5,5,5,5,5,5,5,1,5,5,5,1,3,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,3,1,5,1,2,1,1,5,1,1];
var soul_level = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var total_max_points = 0;
var used_points = 0;

$(document).ready(function() {
    var point_display = document.getElementsByClassName('aod-talent-tree-talent-points');
    talentC();
    for(var i=0;i < talents.length;i++){
        point_display[i] = point_display[i].textContent = talent_points[i].toString() + "/" + talent_points_max[i].toString();
    }

    var e = $('.aod-talent-tree-talent').click(function(e) {
        console.log()
        if(this.getAttribute('data-cell') == 1 && talent_points[0] < talent_points_max[0]) {
            var test = document.getElementById('slayer');
            console.log(test);
            used_points++;
            talent_points[0] = talent_points[0] + 1;
            test = test.textContent = talent_points[0].toString() + "/" + talent_points_max[0].toString();
        }

    window.oncontextmenu = (e) => {
      e.preventDefault()
        if(this.getAttribute('data-cell') == 1 && talent_points[0] > 0) {
            var test = document.getElementById('slayer');
            console.log(test);
            used_points--;
            talent_points[0] = talent_points[0] - 1;
            test = test.textContent = talent_points[0].toString() + "/" + talent_points_max[0].toString();
            console.log(used_points);
            console.log(total_max_points);
            talentC();
        }
    }
        
    talentC();
    });
});
/* $("#list").on("change",listQ); */
document.getElementById("rebirth").onchange = listQ;

function talentC(){
    total_max_points = soul_level.reduce((accumulator, current) => accumulator + current);
    var max_points = document.getElementById('points-max').textContent = "Total Maximum Points: "+total_max_points.toString();
    var remaining_points = document.getElementById('points-left').textContent = "Total Remaining Points: "+(total_max_points-used_points).toString();
}

function listQ(){
    soul_level[26] = Number($(this).val());
    talentC();
}

$('.aod-talent-tree-talent').hover(function () {
    var talentHover = this.getAttribute('data-cell')-1;
    var name = this.id.toString();
    var desc = data[name][talent_points[talentHover]].description;
    console.log(desc);
    var overlay = document.getElementById('talent-description');
    var title = document.getElementById('talent-title').textContent = name.charAt(0).toUpperCase() + name.slice(1)
    var tooltip = document.getElementById('talent-descr').textContent = desc;

    $(overlay).stop().fadeIn();
}, function () {
    $(document.getElementById('talent-description')).stop().fadeOut();
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
    talentC();
});