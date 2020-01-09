import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

import './hammer.js';

const grid = initializeIsotope('.item__grid');
const url = window.location.href.includes('outfits') ? '/outfits' : '/';

const subpage = document.querySelector('#subpage-wrapper');
const hammertime = new Hammer(subpage);
hammertime.on('swiperight', closeSubpage);

grid.shuffle();

imagesLoaded('.item__grid', () => {
  grid.layout();
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('item')) {
    openSubpage(e);
  } else if (e.target.classList.contains('subpage__close')) {
    closeSubpage();
  } else if (e.target.classList.contains('nav__color')) {
    closeNav();
    selectColor(e);
  } else if (e.target.classList.contains('nav__category')) {
    closeNav();
    selectType(e);
  } else if (e.target.classList.contains('select-year')) {
    closeNav();
    const active = document.querySelector('.is-active');
    if (active) active.classList.remove('is-active');
    setTimeout(function() {
      e.target.classList.add('is-active');
    }, 100);
    selectYear(e);
  } else if (e.target.classList.contains('nav-mobile')) {
    e.target.classList.toggle('is-open');
    document.querySelector('nav').classList.toggle('is-active');
  } else if (e.target.classList.contains('subpage__image--zm')) {
    openFullscreen(e.target);
  }
});

/**
 * closes all the nav stuff
 */
function closeNav() {
  document.querySelector('nav').classList.remove('is-active');
  document.querySelector('.nav-mobile').classList.remove('is-open');
}

/**
 * Opens the subpage, with content from generated HTML file
 * @param {MouseEvent} e - click event
 */
function openSubpage(e) {
  e.preventDefault();
  closeNav();
  const sp = document.getElementById('subpage-wrapper');
  sp.classList.remove('is-hidden');
  const url = e.target.href;
  const name = e.target.dataset.name;
  document.querySelector('body').classList.add('is-fixed');
  getRequest(url)
    .then((html) => {
      sp.innerHTML = html.innerHTML;
      // sp.classList.remove('is-hidden');
      imagesLoaded('.subpage__grid', function() {
        initializeIsotope('.subpage__grid');
      });
    });
  history.pushState('', name, url);
  document.title = name;
}

/**
 * get subpage content
 * @param {string} url
 * @return {object} json
 */
async function getRequest(url) {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.querySelector('#subpage-wrapper');
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Close the subpage
 */
function closeSubpage() {
  const sp = document.getElementById('subpage-wrapper');
  sp.classList.add('is-hidden');
  if (window.location.href.includes('looks')) document.title = 'Outfits';
  else document.title = 'Closet';

  history.pushState('', name, url);
  document.querySelector('body').classList.remove('is-fixed');
  document.activeElement.blur();
  setTimeout(function() {
    sp.innerHTML = '';
  }, 900);
}

/**
 * initialize isotope
 * @param {Element} selector
 * @return {Element}
 */
function initializeIsotope(selector) {
  if (document.querySelector(selector)) {
    return new Isotope(selector, {
      hiddenStyle: {
        opacity: 0,
      },
      visibleStyle: {
        opacity: 1,
      },
      itemSelector: '.item',
      percentPosition: true,
      layoutMode: 'masonry',
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
  document.querySelector('.content').scrollTop = 0;
  if (e.target.dataset.color === '*') {
    grid.arrange({
      filter: '',
    });
  } else {
    grid.arrange({
      filter: `.${e.target.dataset.color}`,
    });
  }
}

/**
 * select type of clothing
 * @param {Event} e
 */
function selectType(e) {
  document.querySelector('.content').scrollTop = 0;
  if (e.target.dataset.type === '*') {
    grid.arrange({
      filter: '',
    });
  } else {
    grid.arrange({
      filter: `.${e.target.dataset.type}`,
    });
  }
}

/**
 * select year range
 * @param {Event} e
 */
function selectYear(e) {
  document.querySelector('.content').scrollTop = 0;
  if (e.target.dataset.year === '*') {
    grid.arrange({
      filter: '',
    });
  } else {
    grid.arrange({
      filter: `.year-${e.target.dataset.year}`,
    });
  }
}

/**
 * init full screen viewer for subpage images
 * @param {Element} elem
 */
function openFullscreen(elem) {

}

