import SmartView from './smart-view.js';

const createCommentTemplate = (comments) => comments.map((comment) => (`<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${comment.emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`)).join('');

const createDetailsTemplate = (film) => {
  const {name, inWatchlist, isWatched, isFavorite, genre, description, comments, poster, rating, time, year, isEmotion, activeEmoji, textComment} = film;
  const watchlistActive = inWatchlist ? ' film-details__control-button--active' : '';
  const watchedActive = isWatched ? ' film-details__control-button--active' : '';
  const favoriteActive = isFavorite ? ' film-details__control-button--active' : '';
  const commentsTemplate = createCommentTemplate(comments);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${name}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Anthony Mann</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">30 March ${year}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${time}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${genre}</span>
                  <span class="film-details__genre">${genre}</span>
                  <span class="film-details__genre">${genre}</span></td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist${watchlistActive}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched${watchedActive}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite${favoriteActive}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">${commentsTemplate}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${isEmotion ? `<img src="images/emoji/${activeEmoji}.png" width="55" height="55" alt="emoji-${activeEmoji}">` : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textComment}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
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

  constructor(film) {
    super();
    this.#film = film;
    this._data = DetailsView.parseFilmToData(film);

    this.#setInnerHandlers();
  }

  get template() {
    return createDetailsTemplate(this._data);
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

  #closeBtnHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({textComment: evt.target.value}, true);
  }

  #emojiSmileHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmotion: true,
      activeEmoji: "smile",
    });
  }

  #emojiSleepingHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmotion: true,
      activeEmoji: "sleeping",
    });
  }

  #emojiPukeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmotion: true,
      activeEmoji: "puke",
    });
  }

  #emojiAngryHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmotion: true,
      activeEmoji: "angry",
    });
  }

  #scrollPositionHandler = (evt) => {
    const a = this.scrollY;
    console.log(a);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseClickHandler(this._callback.click);
  }

  #setInnerHandlers = () => {
    this.element.querySelector("#emoji-smile").addEventListener('click', this.#emojiSmileHandler);
    this.element.querySelector("#emoji-sleeping").addEventListener('click', this.#emojiSleepingHandler);
    this.element.querySelector("#emoji-puke").addEventListener('click', this.#emojiPukeHandler);
    this.element.querySelector("#emoji-angry").addEventListener('click', this.#emojiAngryHandler);
    this.element.querySelector(".film-details__comment-input").addEventListener('input', this.#commentInputHandler);
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
  }

  reset = (film) => {
    this.updateData(
      DetailsView.parseFilmToData(film),
    );
  }

  static parseFilmToData = (film) => ({...film,
    scrollPosition: 0,
    isEmotion: false,
    activeEmoji: '',
    textComment: '',
  })

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.scrollPosition;
    delete film.isEmotion;
    delete film.activeEmoji;
    delete film.textComment;

    return film;
  }
}
