import FilmView from '../view/film-view.js';
import DetailsView from '../view/details-view.js';
import {render, renderPosition, remove, replace} from '../render.js';
import {isEscKey} from '../utils.js';

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
    const prevFilmCard = this.#filmCard;
    const prevFilmDetails = this.#filmDetails;

    this.#filmCard = new FilmView(film);
    this.#filmDetails = new DetailsView(film);
    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetails.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetails.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetails.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetails.setCloseClickHandler(this.#destroyDetails);

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

  #showDetails = () => {
    this.#filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
      this.#destroyDetails();
      render(bodyElement, this.#filmDetails, renderPosition.BEFOREEND);
      openedPopup = this.#filmDetails;
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
    });
  }

  destroy = () => {
    remove(this.#filmCard);
  }

  #destroyDetails = () => {
    this.#filmDetails.reset(this.#film);
    if (openedPopup === null) {
      return;
    }
    openedPopup.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    bodyElement.classList.remove('hide-overflow');
  }

  #onEscKeyDown = (e) => {
    if (isEscKey(e)) {
      e.preventDefault();
      this.#destroyDetails();
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#film, inWatchlist: !this.#film.inWatchlist});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }
}
