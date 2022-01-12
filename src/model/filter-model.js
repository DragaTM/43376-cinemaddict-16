import AbstractObsevable from '../abstract-observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends AbstractObsevable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
