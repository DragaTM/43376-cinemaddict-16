import ProfileView from './view/profile-view.js';
import MenuView from './view/menu-view.js';
import StatsView from './view/stats-view.js';
import TotalView from './view/total-view.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-service.js';
import {render, renderPosition, remove} from './render.js';
import {MenuItem} from './const.js';

const AUTHORIZATION = 'Basic jksdflw574hhssdwriyp';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');
const menuComponent = new MenuView();
const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
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

const counts = {
  all: 44, //films.length,
  history: 3,//films.filter((film) => film.isWatched).length,
};

render(siteHeaderElement, new ProfileView(counts.history), renderPosition.BEFOREEND);

filterPresenter.init();
mainPresenter.init();

filmsModel.init().finally(() => {
  render(siteMainElement, menuComponent, renderPosition.AFTERBEGIN);
  menuComponent.setMenuClickHandler(handleMenuClick);
});

render(siteFooterStatElement, new TotalView(counts.all), renderPosition.BEFOREEND);
