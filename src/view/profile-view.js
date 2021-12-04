export const createProfileTemplate = (history) => {
  let rank = '';
  if (history > 0) {rank = 'Novice';}
  if (history > 10) {rank = 'Fun';}
  if (history > 20) {rank = 'Movie buff';}

  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
