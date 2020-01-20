import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

import './hammer.js';

const grid = initializeIsotope('.item__grid');
const url = window.location.href.includes('outfits') ? '/outfits' : '/';


// swipe functionality on subpage
const subpage = document.querySelector('#subpage-wrapper');
if (subpage) {
  const hammertime = new Hammer(subpage);
  hammertime.on('swiperight', closeSubpage);
}

if (grid) {
  grid.shuffle();
  imagesLoaded('.item__grid', () => {
    grid.layout();
  });
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('item')) {
    openSubpage(e);
  } else if (e.target.classList.contains('subpage__close')) {
    closeSubpage();
  } else if (e.target.classList.contains('nav__color')) {
    closeNav();
    selectColor(e);
  } else if (e.target.classList.contains('select-year')) {
    closeNav();
    selectYear(e);
  } else if (e.target.classList.contains('nav__category')) {
    closeNav();
    selectType(e);
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
  subpageLoader();
  const sp = document.getElementById('subpage-wrapper');
  sp.classList.remove('is-hidden');
  document.querySelector('body').classList.add('is-fixed');
  const url = e.target.href;
  const name = e.target.dataset.name;
  getRequest(url)
    .then((html) => {
      sp.innerHTML = html.innerHTML;
      new LazyLoad({elements_selector: '.load-first'});
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
  const urlArr = url.split('/');
  amplitude.getInstance().logEvent('Open Subpage', {
    'path': urlArr[4],
    'category': urlArr[3],
  });
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
  setTimeout(subpageLoader, 900);
}

/**
 * Replace subpage content with loader
 */
function subpageLoader() {
  const sp = document.getElementById('subpage-wrapper');
  sp.innerHTML = '<div class="loader__wrapper"><div class="loader"></div></div>';
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
  amplitude.getInstance().logEvent('Change Color', {'color': e.target.dataset.color});
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
  amplitude.getInstance().logEvent('Change Clothing Category', {'category': e.target.dataset.type});
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
  amplitude.getInstance().logEvent('Change Year', {'year': e.target.dataset.year});
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
 * explictly set height bc of mobile browswers
 */
function setPageHeight() {
  document.querySelector('#main').style.height = window.innerHeight + 'px';
}

// reset the height whenever the window's resized
window.addEventListener('resize', setPageHeight);
// called to initially set the height.
setPageHeight();


amplitude.getInstance().logEvent('Page Viewed', {'location': window.location.pathname});

