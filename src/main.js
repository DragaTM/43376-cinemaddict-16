import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import StatsView from './view/stats-view.js';
import TotalView from './view/total-view.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, renderPosition, remove} from './render.js';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT, MenuItem} from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');
const films = Array.from({length: FILM_COUNT}, generateFilm);
const counts = {
  all: films.length,
  history: films.filter((film) => film.isWatched).length,
};
const menuComponent = new MenuView();
const filmsModel = new FilmsModel();
filmsModel.films = films;
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(menuComponent, filterModel, filmsModel);
const mainPresenter = new MainPresenter(siteMainElement, filmsModel, filterModel);
let statsComponent = new StatsView(filmsModel.films);
const clearPage = () => {
  mainPresenter.destroy();
  remove(statsComponent);
};
const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      clearPage();
      mainPresenter.init();
      break;
    case MenuItem.STATS:
      clearPage();
      statsComponent = new StatsView(filmsModel.films);
      render(siteMainElement, statsComponent, renderPosition.BEFOREEND);
      break;
  }
};

render(siteHeaderElement, new ProfileView(counts.history), renderPosition.BEFOREEND);
render(siteMainElement, menuComponent, renderPosition.BEFOREEND);
menuComponent.setMenuClickHandler(handleMenuClick);
filterPresenter.init();
mainPresenter.init();
render(siteFooterStatElement, new TotalView(counts.all), renderPosition.BEFOREEND);
