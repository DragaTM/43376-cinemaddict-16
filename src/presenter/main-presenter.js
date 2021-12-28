import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import FilmPresenter from './film-presenter.js';
import CommentedView from '../view/commented-view.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP, SortType} from '../const.js';
import {updateItem} from '../utils.js';

export default class MainPresenter {
  #emptyComponent = new EmptyView();
  #sortComponent = new SortView();
  #filmListComponent = new ContentView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #siteListElement = null;
  #siteMainElement = null;
  #films = [];
  #soursedFilms = [];
  #currentSortType = SortType.DEFAULT;
  #filmPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(siteMainElement) {
    this.#siteMainElement = siteMainElement;
  }

  init = (films) => {
    this.#films = [...films];
    this.#soursedFilms = [...films];

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
    const filmPresenter = new FilmPresenter(siteListElement, this.#handleFilmChange);
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

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#siteListElement, this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn(this.#siteListElement);
    }
  }

  #renderShowMoreBtn = () => {
    render(this.#siteListElement, this.#showMoreBtnComponent, renderPosition.AFTEREND);

    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  }

  #handleShowMoreBtnClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        this.#renderFilm(this.#siteListElement, film);
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreBtnComponent);
    }
  }

  #clearContent = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  }

  #handleFilmChange = (updateFilm) => {
    this.#films = updateItem(this.#films, updateFilm);
    this.#soursedFilms = updateItem(this.#soursedFilms, updateItem);
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort((filmA, filmB) => {const result = filmB.year - filmA.year; return result;});
        break;
      case SortType.RATING:
        this.#films.sort((filmA, filmB) => {const result = filmB.rating - filmA.rating; return result;});
        break;
      default:
        this.#films = [...this.#soursedFilms];
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#sortFilms(sortType);
    this.#clearContent();
    this.#renderContent();
    this.#currentSortType = sortType;
  }
}
