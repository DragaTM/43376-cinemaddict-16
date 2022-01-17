import DetailsView from '../view/details-view.js';
import {render, renderPosition, remove, replace} from '../render.js';
import {UserAction, UpdateType, isEscKey, isSubmitKeys} from '../const.js';

const bodyElement = document.querySelector('body');

export default class DetailsPresenter {
  #changeData = null;
  #filmDetails = null;
  #film = null;

  constructor(changeData) {
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmDetails = this.#filmDetails;
    this.#filmDetails = new DetailsView(film);
    this.#setAllHandlers();
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#handleAddComment);

    if (prevFilmDetails === null) {
      render(bodyElement, this.#filmDetails, renderPosition.BEFOREEND);
      return;
    }

    if (bodyElement.contains(prevFilmDetails.element)) {
      replace(this.#filmDetails, prevFilmDetails);
    }

    remove(prevFilmDetails);
  }

  #setAllHandlers = () => {
    this.#filmDetails.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetails.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetails.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetails.setCloseClickHandler(this.destroy);
    this.#filmDetails.setDeleteCommentHandler(this.#handleDeleteComment);
  }

  destroy = () => {
    this.#filmDetails.reset(this.#film);
    this.#filmDetails.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#handleAddComment);
    bodyElement.classList.remove('hide-overflow');
  }

  #onEscKeyDown = (e) => {
    if (isEscKey(e)) {
      e.preventDefault();
      this.destroy();
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
