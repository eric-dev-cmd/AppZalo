
const birthday = document.getElementById('birthday').value;
const day = birthday.split('/')[0];
const month = birthday.split('/')[1];
const year = birthday.split('/')[2];
document.getElementById("day").innerHTML = day;
document.getElementById("month").innerHTML = month;
document.getElementById("year").innerHTML = year;


const gender = document.getElementById('gender').value;
if(gender === 'male'){
    document.getElementById("radio1").setAttribute('checked','checked');
}else{
    document.getElementById("radio2").setAttribute('checked','checked');
}