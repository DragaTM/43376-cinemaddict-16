import ProfileView from '../view/profile-view.js';
import SortView from '../view/sort-view.js';
import MainView from '../view/main-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import CommentedView from '../view/commented-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import DetailsPresenter from './details-presenter.js';
import TotalView from '../view/total-view.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT_PER_STEP, SortType, UpdateType, FilterType, UserAction} from '../const.js';
import {sortByDate, sortByRating, sortById, sortByCommented, filter} from '../utils.js';

const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');

export default class MainPresenter {
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;
  #emptyComponent = null;
  #sortComponent = null;
  #profileComponent = null;
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
  #detailsPresenter = null;
  #detailsId = null;
  #isLoading = true;

  constructor(siteMainElement, filmsModel, filterModel, commentsModel) {
    this.#siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
      default:
        return filteredFilms.sort(sortById);
    }
  }

  getNofilteredFilms = () => {
    const films = this.#filmsModel.films;
    return films;
  }

  init = () => {
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#renderMain();
    this.#renderContent({resetSortType: true});
  }

  destroy = () => {
    remove(this.#mainComponent);
    this.#clearContent();

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);
  }

  #renderProfile = () => {
    const watchedFilmsCount = this.films.filter((film) => film.isWatched).length;
    this.#profileComponent =  new ProfileView(watchedFilmsCount);
    render(siteHeaderElement, this.#profileComponent, renderPosition.BEFOREEND);
  }

  #renderTotal = () => {
    render(siteFooterStatElement, new TotalView(this.films.length), renderPosition.BEFOREEND);
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
    }

    this.#renderRated();
    this.#renderCommented();
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

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  }

  #clearContent = (resetSortType = false) => {
    remove(this.#sortComponent);
    this.#clearFilmList();
    remove(this.#emptyComponent);
    remove(this.#ratedComponent);
    remove(this.#commentedComponent);

    this.#renderedFilmCount = FILM_COUNT_PER_STEP;

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
    const filmPresenter = new FilmPresenter(filmListElement, this.#handleViewAction, this.#openDetails);
    filmPresenter.init(film, this.#openDetails);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #openDetails = (film) => {
    this.#closeDetails();
    this.#detailsPresenter = new DetailsPresenter(this.#handleViewAction, this.#commentsModel);
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
    const ratingFilms = this.#filmsModel.films.filter((film) => film.rating > 0);

    if (ratingFilms.length === 0) {
      return;
    }

    const sortedRatingFilms = ratingFilms.sort(sortByRating).slice(0, 2);
    const ratedFilmsList = this.#ratedComponent.element.querySelector('.films-list__container');

    render(this.#mainElement, this.#ratedComponent, renderPosition.BEFOREEND);

    sortedRatingFilms.forEach((film) => {
      
    });
  }

  #renderCommented = () => {
    const commentedFilms = this.#filmsModel.films.filter((film) => film.comments.length > 0);

    if (commentedFilms.length === 0) {
      return;
    }

    const sortedCommentedFilms = commentedFilms.sort(sortByCommented).slice(0, 2);
    const commentedFilmsList = this.#commentedComponent.element.querySelector('.films-list__container');

    render(this.#mainElement, this.#commentedComponent, renderPosition.BEFOREEND);

    sortedCommentedFilms.forEach((film) => {
      
    });
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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#detailsPresenter.setAddingComment();
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#detailsPresenter.setDeletingComment();
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        this.#detailsPresenter.init(data);
        remove(this.#commentedComponent);
        this.#renderCommented();
        break;
      case UpdateType.MINOR:
        this.#renderContent();
        remove(this.#profileComponent);
        this.#renderProfile();
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
        this.#renderProfile();
        this.#renderTotal();
        break;
      case UpdateType.ERROR_DELETE_COMMENT:
        this.#detailsPresenter.setAbortingDeleteComment();
        break;
      case UpdateType.ERROR_ADD_COMMENT:
        this.#detailsPresenter.setAbortingAddComment();
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
