import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils.js';

const generateDescription = () => {
  const descriptions = [
    'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a trs',
    'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brants narrow escap',
    'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on',
    'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti',
    'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateName = () => {
  const names = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];

  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'Musical',
    'Drama',
    'Thriller',
    'Action',
    'Horror',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateTime = () => {
  const times = [
    '1h 35m',
    '1h 44m',
    '1h 57m',
    '2h 03m',
    '2h 21m',
  ];

  const randomIndex = getRandomInteger(0, times.length - 1);

  return times[randomIndex];
};

const generateYear = () => {
  const randomYear = getRandomInteger(1930, 2021);

  return randomYear;
};

const generateRating = () => {
  const randomRating = getRandomInteger(0, 100)/10;

  return randomRating;
};

const generatePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateComments = () => {
  const randomCount = getRandomInteger(0, 4);
  const emoji = [
    './images/emoji/smile.png',
    './images/emoji/sleeping.png',
    './images/emoji/puke.png',
    './images/emoji/angry.png',
  ];

  const text = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];

  const author = [
    'Tim Macoveev',
    'John Doe',
    'Anonim',
    'Bruce Lee',
  ];

  const date = [
    '2019/12/31 23:59',
    '2 days ago',
    '2 days ago',
    'Today',
  ];
  const comments = [];
  for (let i = 0; i < randomCount; i++){
    const randomIndex = getRandomInteger(0, 3);
    const comment = {
      emoji: emoji[randomIndex],
      text: text[randomIndex],
      author: author[randomIndex],
      date: date[randomIndex]
    };
    comments.push(comment);
  }
  return comments;
}

export const generateFilm = () => ({
  id: nanoid(),
  name: generateName(),
  inWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  rating: generateRating(),
  year: generateYear(),
  time: generateTime(),
  genre: generateGenre(),
  description: generateDescription(),
  comments: generateComments(),
  poster: generatePoster(),
});
