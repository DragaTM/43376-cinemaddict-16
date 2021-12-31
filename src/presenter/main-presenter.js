
import MenuView from '../view/menu-view.js';
import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import CommentedView from '../view/commented-view.js';
import FilmPresenter from './film-presenter.js';
import FilmsModel from '../model/films-model.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP, SortType, UpdateType} from '../const.js';
import {sortByYear, sortByRating} from '../utils.js';

export default class MainPresenter {
  #filmsModel = null;
  #menuComponent = null;
  #emptyComponent = new EmptyView();
  #sortComponent = null;
  #filmListComponent = new ContentView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #ratedComponent = new RatedView();
  #commentedComponent = new CommentedView();
  #siteListElement = null;
  #siteMainElement = null;
  #currentSortType = SortType.DEFAULT;
  #filmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #counts = null;

  constructor(siteMainElement, filmsModel, counts) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#counts = counts;
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortByYear);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortByRating);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderMain();
  }

  #renderMain = () => {
    this.#renderMenu();
    if (FILM_COUNT === 0) {
      this.#renderEmpty();
    } else {
      this.#renderSort();
      this.#renderContent();
    }
    this.#renderRated();
    this.#renderCommented();
  }

  #clearMain = () => {
    remove(this.#menuComponent);
    if (FILM_COUNT === 0) {
      remove(this.#emptyComponent);
    } else {
      remove(this.#sortComponent);
      this.#clearContent();
    }
    remove(this.#ratedComponent);
    remove(this.#commentedComponent);

  }

  #renderMenu = () => {
    this.#menuComponent = new MenuView(this.#counts);
    render(this.#siteMainElement, this.#menuComponent, renderPosition.BEFOREEND);
  }

  #renderEmpty = () => {
    render(this.#siteMainElement, this.#emptyComponent, renderPosition.BEFOREEND);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#siteMainElement, this.#sortComponent, renderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (siteListElement, film) => {
    const filmPresenter = new FilmPresenter(siteListElement, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderRated = () => {
    const siteFilmsElement = document.querySelector('.films');
    render(siteFilmsElement, this.#ratedComponent, renderPosition.BEFOREEND);
  }

  #renderCommented = () => {this.#ratedComponent
    const siteFilmsElement = document.querySelector('.films');
    render(siteFilmsElement, this.#commentedComponent, renderPosition.BEFOREEND);
  }

  #renderContent = () => {
    render(this.#siteMainElement, this.#filmListComponent, renderPosition.BEFOREEND);

    const siteFilmsElement = document.querySelector('.films');
    this.#siteListElement = siteFilmsElement.querySelector('.films-list__container');

    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    
    films.forEach((film) => {
      this.#renderFilm(this.#siteListElement, film);
    });

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn(this.#siteListElement);
    }
  }

  #renderShowMoreBtn = () => {
    render(this.#siteListElement, this.#showMoreBtnComponent, renderPosition.AFTEREND);

    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  }

  #handleShowMoreBtnClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    films.forEach((film) => {
      this.#renderFilm(this.#siteListElement, film);
    });
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtnComponent);
    }
  }

  #clearContent = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    this.#filmsModel.updateFilm(updateType, update);
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить карточку фильма если добавился/удалился комментарий
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        // - обновить список если фильм поменял флаг просмотра, избранного или любимого
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMain();
    this.#renderMain();
  }
}
