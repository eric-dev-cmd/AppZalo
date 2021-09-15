/**
 * TODO: Tab left
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const tabs = $$('.tab-item');
const panes = $$('.tab-pane');
const tabActive = $('.tab-item.active');

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $('.tab-item.active').classList.remove('active');
        $('.tab-pane.active').classList.remove('active');
        this.classList.add('active');
        pane.classList.add('active');
    };
});
/**
 * TODO: Click show image
 */
var modal = document.getElementById('myModal');
var img = document.getElementById('myImg');
var modalImg = document.getElementById('img01');
var captionText = document.getElementById('caption');
img.onclick = function () {
    modal.style.display = 'block';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
};
var span = document.getElementsByClassName('close')[0];
span.onclick = function () {
    modal.style.display = 'none';
};

const cardHeaderClick = $('.card-header-click');
const cardBodyClick = $('.card-body-click');
cardHeaderClick.onclick = function () {
    if (cardBodyClick.style.display === 'none') {
        cardBodyClick.style.display = 'block';
    } else {
        cardBodyClick.style.display = 'none';
    }
};
const cardHeaderClickAtt = $('.card-header-click-att');
const cardBodyClickAtt = $('.card-body-click-att');
cardHeaderClickAtt.onclick = function () {
    if (cardBodyClickAtt.style.display === 'none') {
        cardBodyClickAtt.style.display = 'block';
    } else {
        cardBodyClickAtt.style.display = 'none';
    }
};
