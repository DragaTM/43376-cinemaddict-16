import FilmView from '../view/film-view.js';
import {render, renderPosition, remove, replace} from '../render.js';
import {UserAction, UpdateType} from '../const.js';

export default class FilmPresenter {
  #siteListElement = null;
  #changeData = null;
  #filmCard = null;
  #film = null;
  #openDetails = null;

  constructor(siteListElement, changeData) {
    this.#siteListElement = siteListElement;
    this.#changeData = changeData;
  }

  init = (film, openDetails) => {
    this.#film = film;
    const prevFilmCard = this.#filmCard;
    this.#filmCard = new FilmView(film);
    this.#setAllHandlers();
    this.#openDetails = openDetails;

    if (prevFilmCard === null) {
      render(this.#siteListElement, this.#filmCard, renderPosition.BEFOREEND);
      return;
    }

    if (this.#siteListElement.contains(prevFilmCard.element)) {
      replace(this.#filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  #setAllHandlers = () => {
    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCard.setOpenDetailsHandler(this.#handleOpenDetails);
  }

  destroy = () => {
    remove(this.#filmCard);
  }

  #handleOpenDetails = () => {
    this.#openDetails(this.#film);
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
