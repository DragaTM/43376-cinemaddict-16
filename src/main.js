import {createProfileTemplate} from './view/profile-view.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createContentTemplate} from './view/content-view.js';
import {createCardTemplate} from './view/card-view.js';
import {createShowMoreBtnTemplate} from './view/show-more-btn-view.js';
import {createRatedTemplate} from './view/rated-view.js';
import {createCommentedTemplate} from './view/commented-view.js';
import {createStatTemplate} from './view/stat-view.js';
import {renderTemplate, renderPosition} from './render.js';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const films = Array.from({length: FILM_COUNT}, generateFilm);
const counts = {
  all: films.length,
  watchlist: films.filter((film) => film.inWatchlist).length,
  history: films.filter((film) => film.isWatched).length,
  favorite: films.filter((film) => film.isFavorite).length,
};

renderTemplate(siteHeaderElement, createProfileTemplate(counts.history), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMenuTemplate(counts), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createContentTemplate(), renderPosition.BEFOREEND);

const siteFilmsElement = document.querySelector('.films');
const siteListElement = siteFilmsElement.querySelector('.films-list__container');


for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(siteListElement, createCardTemplate(films[i]), renderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderFilmCount = FILM_COUNT_PER_STEP;

  renderTemplate(siteListElement, createShowMoreBtnTemplate(), renderPosition.AFTEREND);

  const showMoreBtn = siteFilmsElement.querySelector('.films-list__show-more');
  showMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    films
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(siteListElement, createCardTemplate(film), renderPosition.BEFOREEND));

    renderFilmCount += FILM_COUNT_PER_STEP;

    if (renderFilmCount >= films.length) {
      showMoreBtn.remove();
    }

  });
}

renderTemplate(siteFilmsElement, createRatedTemplate(), renderPosition.BEFOREEND);

const siteRatedFilmsElement = document.querySelector('.films-list--rated .films-list__container');

const RATED_COUNT = 2;
for (let i = 0; i < RATED_COUNT; i++) {
  renderTemplate(siteRatedFilmsElement, createCardTemplate(films[i]), renderPosition.BEFOREEND);
}

renderTemplate(siteFilmsElement, createCommentedTemplate(), renderPosition.BEFOREEND);

const siteCommentedFilmsElement = document.querySelector('.films-list--commented .films-list__container');

const COMMENTED_COUNT = 2;
for (let i = 0; i < COMMENTED_COUNT; i++) {
  renderTemplate(siteCommentedFilmsElement, createCardTemplate(films[i]), renderPosition.BEFOREEND);
}

const siteFooterStatElement = document.querySelector('.footer__statistics');
renderTemplate(siteFooterStatElement, createStatTemplate(counts.all), renderPosition.BEFOREEND);


