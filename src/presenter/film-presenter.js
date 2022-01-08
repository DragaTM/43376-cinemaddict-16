import FilmView from '../view/film-view.js';
import DetailsView from '../view/details-view.js';
import {render, renderPosition, remove, replace} from '../render.js';
import {isEscKey, isSubmitKeys} from '../utils.js';
import {UserAction, UpdateType} from '../const.js';

const bodyElement = document.querySelector('body');
let openedPopup = null;

export default class FilmPresenter {
  #siteListElement = null;
  #changeData = null;
  #filmCard = null;
  #filmDetails = null;
  #film = null;

  constructor(siteListElement, changeData) {
    this.#siteListElement = siteListElement;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;
    this.#filmCard = new FilmView(film);
    this.#filmDetails = new DetailsView(film);
    this.#setAllHandlers();

    render(this.#siteListElement, this.#filmCard, renderPosition.BEFOREEND);
    this.#showDetails();
  }

  patching = (film) => {
    this.#film = film;
    const prevFilmCard = this.#filmCard;
    const prevFilmDetails = this.#filmDetails;

    this.#filmCard = new FilmView(film);
    this.#filmDetails = new DetailsView(film);
    this.#setAllHandlers();

    if (prevFilmCard === null) {
      render(this.#siteListElement, this.#filmCard, renderPosition.BEFOREEND);
      this.#showDetails();
      return;
    }

    if (this.#siteListElement.contains(prevFilmCard.element)) {
      replace(this.#filmCard, prevFilmCard);
    }

    if (bodyElement.contains(prevFilmDetails.element)) {
      replace(this.#filmDetails, prevFilmDetails);
    }

    this.#showDetails();
    remove(prevFilmCard);
    remove(prevFilmDetails);
    openedPopup = this.#filmDetails;
  }

  #setAllHandlers = () => {
    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetails.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetails.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetails.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetails.setCloseClickHandler(this.destroyDetails);
    this.#filmDetails.setDeleteCommentHandler(this.#handleDeleteComment);
  }

  #showDetails = () => {
    this.#filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
      this.destroyDetails();
      render(bodyElement, this.#filmDetails, renderPosition.BEFOREEND);
      openedPopup = this.#filmDetails;
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      document.addEventListener('keydown', this.#handleAddComment);
    });
  }

  destroy = () => {
    remove(this.#filmCard);
  }

  destroyDetails = () => {
    this.#filmDetails.reset(this.#film);
    if (openedPopup === null) {
      return;
    }
    openedPopup.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#handleAddComment);
    bodyElement.classList.remove('hide-overflow');
  }

  #onEscKeyDown = (e) => {
    if (isEscKey(e)) {
      e.preventDefault();
      this.destroyDetails();
    }
  };

  #handleDeleteComment = () => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#film,
    );
  }

  #handleAddComment = (e) => {
    if (isSubmitKeys(e)) {
      e.preventDefault();
      this.#filmDetails.addComment();
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this.#film,
      );
    }
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, inWatchlist: !this.#film.inWatchlist},
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched},
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite},
    );
  }
}
