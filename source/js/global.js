import $ from 'jquery';

document.querySelectorAll('.item').forEach((el) => {
  el.addEventListener('click', openSubpage);
});

/**
 * Opens the subpage, with content from generated HTML file
 * Using jquery only because it is easiest way to read html file resp :')
 * @param {MouseEvent} e - click event
 */
function openSubpage(e) {
  e.preventDefault();
  const url = e.target.href;
  const name = e.target.dataset.name;
  $.get(url, null, function(data) {
    const body = $(data)
      .find('#subpage')
      .html();
    document.getElementById('subpage').innerHTML = body;
    history.pushState('', name, url);
    document.querySelector('body').classList.add('is-fixed');
  });
}
