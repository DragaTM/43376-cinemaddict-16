import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import EmptyView from '../view/empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import RatedView from '../view/rated-view.js';
import FilmPresenter from './film-presenter.js';
import CommentedView from '../view/commented-view.js';
import {render, renderPosition, remove} from '../render.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP} from '../const.js';
import {updateItem} from '../utils.js';

const siteMainElement = document.querySelector('.main');

export default class MainPresenter {
  #emptyComponent = new EmptyView();
  #sortComponent = new SortView();
  #filmListComponent = new ContentView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #films = [];
  #filmPresenter = new Map();
  #renderFilmCount = FILM_COUNT_PER_STEP;

  constructor() {

  }

  init = (films) => {
    this.#films = [...films];

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
    render(siteMainElement, this.#emptyComponent, renderPosition.BEFOREEND);
  }

  #renderSort = () => {
    render(siteMainElement, this.#sortComponent, renderPosition.BEFOREEND);
  }

  #renderFilm = (siteListElement, film) => {
    const filmPresenter = new FilmPresenter(siteListElement, film, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderRated = () => {
    const siteFilmsElement = document.querySelector('.films');
    render(siteFilmsElement, new RatedView(), renderPosition.BEFOREEND);

    const siteRatedFilmsElement = document.querySelector('.films-list--rated .films-list__container');

    const RATED_COUNT = 2;
    for (let i = 0; i < RATED_COUNT; i++) {
      this.#renderFilm(siteRatedFilmsElement, this.#films[i]);
    }
  }

  #renderCommented = () => {
    const siteFilmsElement = document.querySelector('.films');

    render(siteFilmsElement, new CommentedView(), renderPosition.BEFOREEND);

    const siteCommentedFilmsElement = document.querySelector('.films-list--commented .films-list__container');

    const COMMENTED_COUNT = 2;
    for (let i = 0; i < COMMENTED_COUNT; i++) {
      this.#renderFilm(siteCommentedFilmsElement, this.#films[i]);
    }
  }

  #renderContent = () => {
    render(siteMainElement, this.#filmListComponent, renderPosition.BEFOREEND);

    const siteFilmsElement = document.querySelector('.films');
    const siteListElement = siteFilmsElement.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(siteListElement, this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn(siteListElement);
    }
  }

  #renderShowMoreBtn = (siteListElement) => {
    render(siteListElement, this.#showMoreBtnComponent, renderPosition.AFTEREND);

    this.#showMoreBtnComponent.element.addEventListener('click', () => {
      this.#films
        .slice(this.#renderFilmCount, this.#renderFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => {
          this.#renderFilm(siteListElement, film);
        });

      this.#renderFilmCount += FILM_COUNT_PER_STEP;

      if (this.#renderFilmCount >= this.#films.length) {
        remove(this.#showMoreBtnComponent);
      }

    });
  }

  #clearContent = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  }

  #handleFilmChange = (updateFilm) => {
    this.#films = updateItem(this.#films, updateFilm);
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }
}
