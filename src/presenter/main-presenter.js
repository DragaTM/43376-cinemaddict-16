import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import CommentedView from '../view/commented-view.js';
import FilmPresenter from './film-presenter.js';
import DetailsPresenter from './details-presenter.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT_PER_STEP, SortType, UpdateType, FilterType} from '../const.js';
import {sortByYear, sortByRating, filter} from '../utils.js';

export default class MainPresenter {
  #filmsModel = null;
  #filterModel = null;
  #emptyComponent = null;
  #sortComponent = null;
  #filmListComponent = new ContentView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #ratedComponent = new RatedView();
  #commentedComponent = new CommentedView();
  #siteListElement = null;
  #siteMainElement = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #filmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #counts = null;
  #detailsPresenter = null;
  #detailsId = null;

  constructor(siteMainElement, filmsModel, filterModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByYear);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderMain();
  }

  destroy = () => {
    this.#clearMain();
    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #renderMain = () => {
    const filmCount = this.films.length;

    if (filmCount === 0) {
      this.#renderEmpty();
    } else {
      this.#renderSort();
      this.#renderContent();
      this.#renderRated();
      this.#renderCommented();
    }
  }

  #clearMain = (resetSortType = false) => {
    remove(this.#sortComponent);
    this.#clearContent();
    remove(this.#emptyComponent);
    remove(this.#ratedComponent);
    remove(this.#commentedComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderEmpty = () => {
    this.#emptyComponent = new EmptyView(this.#filterType);
    render(this.#siteMainElement, this.#emptyComponent, renderPosition.BEFOREEND);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#siteMainElement, this.#sortComponent, renderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (siteListElement, film) => {
    const filmPresenter = new FilmPresenter(siteListElement, this.#handleViewAction);
    filmPresenter.init(film, this.#openDetails);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #openDetails = (film) => {
    this.#closeDetails();
    this.#detailsPresenter = new DetailsPresenter(this.#handleViewAction);
    this.#detailsPresenter.init(film);
    this.#detailsId = film.id;
  }

  #closeDetails = () => {
    if (this.#detailsPresenter !== null) {
      this.#detailsPresenter.destroy();
      this.#detailsId = null;
    }
  }

  #renderRated = () => {
    const siteFilmsElement = document.querySelector('.films');
    render(siteFilmsElement, this.#ratedComponent, renderPosition.BEFOREEND);
  }

  #renderCommented = () => {
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
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        this.#detailsPresenter.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        if (this.#detailsId === data.id) {
          this.#detailsPresenter.init(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetSortType: true});
        this.#renderMain();
        if (this.#detailsId === data.id) {
          this.#detailsPresenter.init(data);
        }
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
