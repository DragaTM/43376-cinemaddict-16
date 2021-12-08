import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import ContentView from './view/content-view.js';
import FilmView from './view/film-view.js';
import ShowMoreBtnView from './view/show-more-btn-view.js';
import RatedView from './view/rated-view.js';
import CommentedView from './view/commented-view.js';
import TotalView from './view/total-view.js';
import DetailsView from './view/details-view.js';
import {render, renderPosition, remove} from './render.js';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP} from './const.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const films = Array.from({length: FILM_COUNT}, generateFilm);
const counts = {
  all: films.length,
  watchlist: films.filter((film) => film.inWatchlist).length,
  history: films.filter((film) => film.isWatched).length,
  favorite: films.filter((film) => film.isFavorite).length,
};

render(siteHeaderElement, new ProfileView(counts.history), renderPosition.BEFOREEND);
render(siteMainElement, new SortView(), renderPosition.BEFOREEND);
render(siteMainElement, new MenuView(counts), renderPosition.BEFOREEND);
render(siteMainElement, new ContentView(), renderPosition.BEFOREEND);

const siteFilmsElement = document.querySelector('.films');
const siteListElement = siteFilmsElement.querySelector('.films-list__container');
const renderFilm = function(film) {
  const filmCard = new FilmView(film);
  const filmDetails = new DetailsView(film);
  render(siteListElement, filmCard, renderPosition.BEFOREEND);
  filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
    render(bodyElement, filmDetails, renderPosition.BEFOREEND);
    bodyElement.classList.add('hide-overflow');
    filmDetails.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      remove(filmDetails);
      bodyElement.classList.remove('hide-overflow');
    });
  });
};

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderFilmCount = FILM_COUNT_PER_STEP;

  const showMoreBtnComponent = new ShowMoreBtnView();
  render(siteListElement, showMoreBtnComponent, renderPosition.AFTEREND);

  showMoreBtnComponent.element.addEventListener('click', () => {
    films
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        renderFilm(film);
      });

    renderFilmCount += FILM_COUNT_PER_STEP;

    if (renderFilmCount >= films.length) {
      remove(showMoreBtnComponent);
    }

  });
}

render(siteFilmsElement, new RatedView(), renderPosition.BEFOREEND);

const siteRatedFilmsElement = document.querySelector('.films-list--rated .films-list__container');

const RATED_COUNT = 2;
for (let i = 0; i < RATED_COUNT; i++) {
  render(siteRatedFilmsElement, new FilmView(films[i]), renderPosition.BEFOREEND);
}

render(siteFilmsElement, new CommentedView(), renderPosition.BEFOREEND);

const siteCommentedFilmsElement = document.querySelector('.films-list--commented .films-list__container');

const COMMENTED_COUNT = 2;
for (let i = 0; i < COMMENTED_COUNT; i++) {
  render(siteCommentedFilmsElement, new FilmView(films[i]), renderPosition.BEFOREEND);
}

const siteFooterStatElement = document.querySelector('.footer__statistics');
render(siteFooterStatElement, new TotalView(counts.all), renderPosition.BEFOREEND);
