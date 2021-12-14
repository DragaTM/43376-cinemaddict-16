import FilmView from '../view/film-view.js';
import DetailsView from '../view/details-view.js';
import {render, renderPosition, remove, replace} from '../render.js';
import {isEscKey} from '../utils.js';

const bodyElement = document.querySelector('body');

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

    this.#filmCard = new FilmView(film);
    this.#filmDetails = new DetailsView(film);
    //this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    //this.#filmCard.setWatchedClickHandler(this.#handleWatchedClick);
    //this.#filmCard.setFavoriteClickHandler(this.#handleFavoriteClick);
    if (prevFilmCard === null) {
      render(this.#siteListElement, this.#filmCard, renderPosition.BEFOREEND);
      this.#showDetails();
      return;
    }
    remove(prevFilmCard);

    if (this.#siteListElement.contains(prevFilmCard.element)) {
      replace(this.#filmCard, prevFilmCard);
    }
    this.#showDetails();
  }

  #showDetails = () => {
    this.#filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
      this.#destroyDetails();
      render(bodyElement, this.#filmDetails, renderPosition.BEFOREEND);
      bodyElement.classList.add('hide-overflow');
      this.#filmDetails.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        this.#destroyDetails();
      });
      document.addEventListener('keydown', this.#onEscKeyDown);
    });
  }

  destroy = () => {
    remove(this.#filmCard);
  }

  #destroyDetails = () => {
    const detailsComponent = bodyElement.querySelector('.film-details');

    if (detailsComponent === null) {
      return;
    }
    detailsComponent.remove();
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
