import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import TotalView from './view/total-view.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, renderPosition} from './render.js';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT} from './const.js';
import {sortByYear, sortByRating} from './utils.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');
const films = Array.from({length: FILM_COUNT}, generateFilm);
const counts = {
  all: films.length,
  history: films.filter((film) => film.isWatched).length,
};
const filters = {
  name: 'All movies',
  type: 'all',
  count: '',
}
const filmsModel = new FilmsModel();
filmsModel.films = films;
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const mainPresenter = new MainPresenter(siteMainElement, filmsModel, filterModel);

render(siteHeaderElement, new ProfileView(counts.history), renderPosition.BEFOREEND);
filterPresenter.init();
mainPresenter.init();
render(siteFooterStatElement, new TotalView(counts.all), renderPosition.BEFOREEND);
