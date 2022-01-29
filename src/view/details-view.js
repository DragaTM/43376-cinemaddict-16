import he from 'he';
import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import {isClickOnInput} from '../const.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import {transformArrayToString, transformMinutesToHours} from '../utils.js';
dayjs.extend(relativeTime);

const createCommentTemplate = (comments) => comments.map((comment) => (`<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`)).join('');

const createDetailsTemplate = (film, comments) => {
  const {name, alternativeName, inWatchlist, isWatched, isFavorite, actors, writers, genre, description, poster, rating, time, releaseDate, isEmotion, activeEmoji, textComment, director, ageRating, country} = film;
  const watchlistActive = inWatchlist ? ' film-details__control-button--active' : '';
  const watchedActive = isWatched ? ' film-details__control-button--active' : '';
  const favoriteActive = isFavorite ? ' film-details__control-button--active' : '';
  const watchlistText = inWatchlist ? 'Already in watchlist' : 'Add to watchlist';
  const watchedText = isWatched ? 'Already watched' : 'Add to watched';
  const favoriteText = isFavorite ? 'Already favorite' : 'Add to favorites';
  const commentsTemplate = createCommentTemplate(comments);
  const date = dayjs(releaseDate).format('D MMMM YYYY');
  const actorsList = transformArrayToString(actors);
  const writersList = transformArrayToString(writers);
  const runTime = transformMinutesToHours(time);
  const genres = genre.map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`).join('');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${alternativeName}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist${watchlistActive}" id="watchlist" name="watchlist">${watchlistText}</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched${watchedActive}" id="watched" name="watched">${watchedText}</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite${favoriteActive}" id="favorite" name="favorite">${favoriteText}</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">${commentsTemplate}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${isEmotion ? `<img src="images/emoji/${activeEmoji}.png" width="55" height="55" alt="emoji-${activeEmoji}">` : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(textComment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="smile" value="smile">
              <label class="film-details__emoji-label" for="smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="puke" value="puke">
              <label class="film-details__emoji-label" for="puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="angry" value="angry">
              <label class="film-details__emoji-label" for="angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class DetailsView extends SmartView{
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this._data = DetailsView.parseFilmToData(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createDetailsTemplate(this._data, this.#comments);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this._callback.watchlistClick);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this._callback.watchedClick);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this._callback.favoriteClick);
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeBtnHandler);
  }

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this._callback.deleteComment);
  }

  #closeBtnHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({textComment: evt.target.value}, true);
  }

  #emojiClickHandler = (evt) => {
    if (isClickOnInput(evt)) {
      return;
    }
    this.updateData({
      isEmotion: true,
      activeEmoji: evt.target.id,
    });
  }

  deleteCommentHandler = (evt) => {
    if (evt.target.className !== 'film-details__comment-delete') {
      return;
    }
    evt.preventDefault();
    const numberOfComment = Array.from(this.element.getElementsByClassName('film-details__comment-delete')).indexOf(evt.target);
    this.deletingCommentId = this._data.comments[numberOfComment];
  }

  getFilm = () => (this.#film)

  addComment = () => {
    if (this._data.activeEmoji === '' || this._data.text === '') {
      return;
    }
    const newComment = {
      emoji: `./images/emoji/${this._data.activeEmoji}.png`,
      text: this._data.textComment,
      date: dayjs(),
      author: 'Author',
    };
    this._data.comments.push(newComment);
    this.#update(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseClickHandler(this._callback.click);
    this.setDeleteCommentHandler(this._callback.deleteComment);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.deleteCommentHandler);
  }

  reset = (film) => {
    this.updateData(
      DetailsView.parseFilmToData(film),
    );
  }

  #update = (data) => {
    this.updateData(
      DetailsView.parseDataToFilm(data),
    );
  }

  static parseFilmToData = (film) => ({...film,
    isEmotion: false,
    activeEmoji: '',
    textComment: '',
  })

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.isEmotion;
    delete film.activeEmoji;
    delete film.textComment;

    return film;
  }
}
