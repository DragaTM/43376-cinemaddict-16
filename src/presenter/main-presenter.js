import SortView from '../view/sort-view.js';
import MainView from '../view/main-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import CommentedView from '../view/commented-view.js';
import LoadingView from '../view/loading-view.js';
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
  #loadingComponent = new LoadingView();
  #mainComponent = new MainView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #ratedComponent = new RatedView();
  #commentedComponent = new CommentedView();
  #siteMainElement = null;
  #statusMessage = null;
  #mainElement = null;
  #filmListElement = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #filmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #counts = null;
  #detailsPresenter = null;
  #detailsId = null;
  #isLoading = true;

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
    this.#renderContent();
  }

  destroy = () => {
    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #renderMain = () => {
    render(this.#siteMainElement, this.#mainComponent, renderPosition.BEFOREEND);

    this.#mainElement = this.#mainComponent.element;
    this.#filmListElement = this.#mainElement.querySelector('.films-list__container');
    this.#statusMessage = this.#mainElement.querySelector('.films-list');
  }

  #renderContent = (resetSortType = false) => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#clearContent();

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    const filmCount = this.films.length;

    if (filmCount === 0) {
      this.#renderEmpty();
    } else {
      this.#renderSort();
      this.#renderFilmList();
      this.#renderRated();
      this.#renderCommented();
    }
  }

  #renderFilmList = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    films.forEach((film) => {
      this.#renderFilm(this.#filmListElement, film);
    });

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn(this.#filmListElement);
    }
  }

  #clearContent = (resetSortType = false) => {
    remove(this.#sortComponent);
    this.#clearFilmList();
    remove(this.#emptyComponent);
    remove(this.#ratedComponent);
    remove(this.#commentedComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderEmpty = () => {
    this.#emptyComponent = new EmptyView(this.#filterType);
    render(this.#statusMessage, this.#emptyComponent, renderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#statusMessage, this.#loadingComponent, renderPosition.AFTERBEGIN);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#mainElement, this.#sortComponent, renderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (filmListElement, film) => {
    const filmPresenter = new FilmPresenter(filmListElement, this.#handleViewAction);
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
    render(this.#mainElement, this.#ratedComponent, renderPosition.BEFOREEND);
  }

  #renderCommented = () => {
    render(this.#mainElement, this.#commentedComponent, renderPosition.BEFOREEND);
  }

  #renderShowMoreBtn = () => {
    render(this.#filmListElement, this.#showMoreBtnComponent, renderPosition.AFTEREND);

    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  }

  #handleShowMoreBtnClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    films.forEach((film) => {
      this.#renderFilm(this.#filmListElement, film);
    });
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtnComponent);
    }
  }

  #clearFilmList = () => {
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
        this.#renderContent();
        if (this.#detailsId === data.id) {
          this.#detailsPresenter.init(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#renderContent({resetSortType: true});
        if (this.#detailsId === data.id) {
          this.#detailsPresenter.init(data);
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#renderContent();
  }
}
