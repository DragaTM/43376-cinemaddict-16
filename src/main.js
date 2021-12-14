import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import TotalView from './view/total-view.js';
import MainPresenter from './presenter/main-presenter.js';
import {render, renderPosition} from './render.js';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');
const films = Array.from({length: FILM_COUNT}, generateFilm);
const counts = {
  all: films.length,
  watchlist: films.filter((film) => film.inWatchlist).length,
  history: films.filter((film) => film.isWatched).length,
  favorite: films.filter((film) => film.isFavorite).length,
};
const mainPresenter = new MainPresenter();

render(siteHeaderElement, new ProfileView(counts.history), renderPosition.BEFOREEND);
render(siteMainElement, new MenuView(counts), renderPosition.BEFOREEND);
mainPresenter.init(films);
render(siteFooterStatElement, new TotalView(counts.all), renderPosition.BEFOREEND);
