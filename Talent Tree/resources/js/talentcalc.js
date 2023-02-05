var talents  = document.getElementsByClassName('aod-talent-tree-talent');
var talent_points = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var talent_points_max = [5,5,5,5,5,5,5,5,5,1,5,5,5,1,3,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,3,1,5,1,2,1,1,5,1,1];
var soul_level = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var total_max_points = 0;
var used_points = 0;
var table = document.getElementById('results').rows;

$(document).ready(function() {
    var point_display = document.getElementsByClassName('aod-talent-tree-talent-points');
    talentC();
    for(var i=0;i < talents.length;i++){
        point_display[i] = point_display[i].textContent = talent_points[i].toString() + "/" + talent_points_max[i].toString();
    }
window.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        ev = ev.target.parentNode.parentNode.parentNode;
        const k = ev.getAttribute('data-cell')-1;
        const pointText = ev.nextElementSibling;
        const remaining_points = total_max_points - used_points;
        if(talent_points[k] > 0 && remaining_points < total_max_points) {
            used_points--;
            talent_points[k] = talent_points[k] - 1;
            const textUpdate = pointText.textContent = talent_points[k].toString() + "/" + talent_points_max[k].toString();
            descUpdate(ev, k);
            talentC();
        }
    });
    var e = $('.aod-talent-tree-talent').click(function(e) {
        const k = this.getAttribute('data-cell')-1;
        const pointText = this.nextElementSibling;
        const remaining_points = total_max_points - used_points;
        var n = [0];
        e.preventDefault();

        if(talent_points[k] < talent_points_max[k] && remaining_points > 0 && this.getAttribute('data-enabled') === "true") {
            used_points++;
            talent_points[k] = talent_points[k] + 1;
            const textUpdate = pointText.textContent = talent_points[k].toString() + "/" + talent_points_max[k].toString();
            descUpdate(this, k);
        }
        if (talent_points[k] == talent_points_max[k]) {
            const from = this.getAttribute('data-cell')
            const connector = document.getElementsByClassName('aod-talent-tree-connection');
            for(i=0; i < connector.length;i++){
                if (from == connector[i].getAttribute('data-from-cell')) {
                    n[i] = connector[i].getAttribute('data-to-cell');
                }
            }
            const next = document.getElementsByClassName('aod-talent-tree-talent');
            for(i=0; i < next.length;i++){
                for(z=0; z < n.length;z++){
                    if (n[z] == next[i].getAttribute('data-cell')){
                        next[i].setAttribute('data-enabled','true');
                    }
                }
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
    var name = this.id.toString().replace(/-/g, ' ');;
    var desc = data[name][talent_points[talentHover]].description;
    var overlay = document.getElementById('talent-description');
    var title = name.charAt(0).toUpperCase() + name.slice(1);
    const words = title.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    document.getElementById('talent-title').textContent = words.join(" ");

    var tooltip = document.getElementById('talent-descr').textContent = desc;

    $(overlay).stop().fadeIn();
});

function descUpdate(e, k){
    var name = e.id.toString().replace(/-/g, ' ');;
    var desc = data[name][talent_points[k]].description;
    var overlay = document.getElementById('talent-description');
    var title = name.charAt(0).toUpperCase() + name.slice(1);
    const words = title.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    title = document.getElementById('talent-title');
    title.textContent = words.join(" ");
    tableData(title)

    var tooltip = document.getElementById('talent-descr').textContent = desc;    
}

function tableData(e) {
    var table = document.getElementById('results');
    console.log(table.rows.length);
    for(count=1;count < table.rows.length;count++){
        console.log(table.rows[count].children[0].innerHTML);
        if(table.rows[count].children[0].innerHTML == "" ){
            var newRow = count;
            console.log(newRow);
            break;
        }
        else if (table[count].children[0].innerText === e.innerText) {
            var newRow = count;

            break;
        }
    }
}

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