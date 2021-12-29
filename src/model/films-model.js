import AbstractObsevable from '../abstract-observable.js';

export default class FilmModel extends AbstractObsevable {
  #films = [];

  set films(films) {
    this.#films = [...films];
  }

  get films(){
    return this.#films;
  }
}