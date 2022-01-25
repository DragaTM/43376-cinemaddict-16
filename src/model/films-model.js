import AbstractObsevable from '../abstract-observable.js';
import {UpdateType} from '../const.js';

export default class FilmModel extends AbstractObsevable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films(){
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      watchingDate: film.user_details['watching_date'] !== null ? new Date(film.user_details['watching_date']) : film.user_details['watching_date'],
      releaseDate: new Date(film.film_info.release['date']),
      name: film.film_info['title'],
      alternativeName: film.film_info['alternative_title'],
      ageRating: film.film_info['age_rating'],
      isWatched: film.user_details['already_watched'],
      isFavorite: film.user_details['favorite'],
      inWatchlist: film.user_details['watchlist'],
      description: film.film_info['description'],
      director: film.film_info['director'],
      poster: film.film_info['poster'],
      rating: film.film_info['total_rating'],
      actors: film.film_info['actors'],
      genre: film.film_info['genre'],
      country: film.film_info.release['release_country'],
      time: film.film_info['runtime'],
      writers: film.film_info['writers'],
    };

    delete adaptedFilm.user_details;
    delete adaptedFilm.film_info;

    return adaptedFilm;
  }
}
