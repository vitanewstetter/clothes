import $ from 'jquery';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

let isotope = null;

imagesLoaded('.item__grid', function() {
  initializeIsotope('.item__grid');
});

imagesLoaded('.subpage__grid', function() {
  initializeIsotope('.subpage__grid');
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('item')) {
    openSubpage(e);
  } else if (e.target.classList.contains('subpage__close')) {
    closeSubpage();
  } else if (e.target.classList.contains('header__color-block')) {
    selectColor(e);
  }
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
      .find('#subpage-wrapper')
      .html();
    const sp = document.getElementById('subpage-wrapper');
    sp.classList.remove('is-hidden');
    sp.innerHTML = body;
    history.pushState('', name, url);
    document.title = name;
    document.querySelector('body').classList.add('is-fixed');
    imagesLoaded('.subpage__grid', function() {
      initializeIsotope('.subpage__grid');
    });
  });
}

/**
 * Close the subpage
 */
function closeSubpage() {
  const sp = document.getElementById('subpage-wrapper');
  sp.classList.add('is-hidden');

  const url = window.location.href.includes('looks') ?
    '/outfits' : '/';
  if (window.location.href.includes('looks')) document.title = 'Outfits';
  else document.title = 'Closet';

  history.pushState('', name, url);
  document.querySelector('body').classList.remove('is-fixed');
  setTimeout(function() {
    sp.innerHTML = '';
  }, 900);
}

/**
 * initialize isotope
 * @param {Element} selector
 */
function initializeIsotope(selector) {
  if (document.querySelector(selector)) {
    isotope = new Isotope(selector, {
      itemSelector: '.item',
      percentPosition: true,
      layoutMode: 'masonry',
      sortBy: 'random',
      masonry: {
        gutter: 16,
      },
      getSortData: {
        mainColor: '[data-main-color]',
        secondaryColor: '[data-primary-color]',
      },
    });
  }
}

/**
 * select color
 * @param {Event} e
 */
function selectColor(e) {
  // const allColors = document.querySelectorAll('.header__color-block');
  // allColors.forEach((block) => {
  //   block.classList.remove('is-active');
  // });
  isotope.arrange({
    filter: `.${e.target.dataset.color}`,
  });
  // console.log(el);
  // el.classList.add('is-active');
  // console.log(el.dataset.color);
}
