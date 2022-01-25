import AbstractObsevable from '../abstract-observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends AbstractObsevable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  loadComments = async (filmId) => {
    try {
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.LOAD_COMMENTS);
  }

  get comments(){
    return this.#comments;
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment
    };

    return adaptedComment;
  }
}
