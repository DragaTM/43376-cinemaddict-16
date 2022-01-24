const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => {
    return this.#load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  updateComments = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      film_info: {
        title: film['name'],
        alternative_title: film['alternativeName'],
        age_rating: film['ageRating'],
        description: film['description'],
        director: film['director'],
        poster: film['poster'],
        total_rating: film['rating'],
        actors: film['actors'],
        genre: film['genre'],
        runtime: film['time'],
        writers: film['writers'],
        release: {
          release_country: film['country'],
          date: film['releaseDate'].toISOString(),
        },
      },
      user_details: {
        watching_date: film['watchingDate'] !== null ? film['watchingDate'].toISOString() : film['watchingDate'],
        already_watched: film['isWatched'],
        favorite: film['isFavorite'],
        watchlist: film['inWatchlist'],
      }
    };

    delete adaptedFilm.watchingDate;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.name;
    delete adaptedFilm.alternativeName;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.inWatchlist;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.actors;
    delete adaptedFilm.genre;
    delete adaptedFilm.country;
    delete adaptedFilm.time;
    delete adaptedFilm.writers;

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
