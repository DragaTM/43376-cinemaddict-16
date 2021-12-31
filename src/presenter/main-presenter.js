import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import CommentedView from '../view/commented-view.js';
import FilmPresenter from './film-presenter.js';
import FilmsModel from '../model/films-model.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP, SortType} from '../const.js';
import {sortByYear, sortByRating} from '../utils.js';

export default class MainPresenter {
  #filmsModel = null;
  #emptyComponent = new EmptyView();
  #sortComponent = new SortView();
  #filmListComponent = new ContentView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #siteListElement = null;
  #siteMainElement = null;
  #currentSortType = SortType.DEFAULT;
  #filmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(siteMainElement, filmsModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
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

    if (FILM_COUNT === 0) {
      this.#renderEmpty();
    } else {
      this.#renderSort();
      this.#renderContent();
    }
    this.#renderRated();
    this.#renderCommented();
  }

  #renderEmpty = () => {
    render(this.#siteMainElement, this.#emptyComponent, renderPosition.BEFOREEND);
  }

  #renderSort = () => {
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
    render(siteFilmsElement, new RatedView(), renderPosition.BEFOREEND);
  }

  #renderCommented = () => {
    const siteFilmsElement = document.querySelector('.films');
    render(siteFilmsElement, new CommentedView(), renderPosition.BEFOREEND);
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
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  #handleFilmChange = (updateFilm) => {
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearContent();
    this.#renderContent();
    this.#currentSortType = sortType;
  }
}
