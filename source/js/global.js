import $ from 'jquery';
import Isotope from 'isotope-layout';
import {bootstrapData, shuffleArray, slugify} from './utils';
import imagesLoaded from 'imagesloaded';

const items = shuffleArray(bootstrapData('items'));
const itemsToAdd = 25;
let idx = 0;
const grid = initializeIsotope('.item__grid');
const url = window.location.href.includes('looks') ? '/outfits' : '/';
const path = window.location.pathname.includes('outfit') ? 'looks' : 'items';

addAllItems();

imagesLoaded('.subpage__grid', function() {
  initializeIsotope('.subpage__grid');
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('item')) {
    openSubpage(e);
  } else if (e.target.classList.contains('subpage__close')) {
    closeSubpage();
  } else if (e.target.classList.contains('nav__color')) {
    selectColor(e);
  } else if (e.target.classList.contains('header__type')) {
    selectType(e);
  }
});

/**
 * Adds next group of items to the grid
 * @param {MouseEvent} e - click event
 */
function addAllItems() {
  const arr = [];
  const gridEl = document.querySelector('.item__grid');
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const el = document.createElement('a');

    el.classList.add('item', 'hidden');

    if (path == 'items') {
      el.classList.add(
        item.main_color,
        item.secondary_color,
        item.category.toLowerCase(),
      );
    }
    // else el.dataSet.date = item.date;

    el.href = `/${path}/${slugify(item.name)}`;
    el.innerHTML = `<img src="${item.image.url}" class="no-click" />`;
    arr.push(el);
    gridEl.appendChild(el);
  }
  grid.appended(arr);
  staggerImageLoad();
};

/**
 * Remove hidden class for all items, as they've loaded
 * @param {MouseEvent} e - click event
 */
function staggerImageLoad() {
  const group = [];
  for (let i = 0; i <itemsToAdd; i++) {
    const item = grid.items[i + idx];
    if (item) group.push(item.element);
  }
  imagesLoaded(group, function() {
    group.forEach((item) => {
      item.classList.remove('hidden');
    });
    idx += itemsToAdd;
    grid.element.classList.remove('hidden');
    grid.arrange();
    staggerImageLoad();
  });
}

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
