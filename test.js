const AppDataSource = require('./data-source');
const Anime = require('./entities/');

async function insertAnime() {
  await AppDataSource.initialize();

  const animeRepo = AppDataSource.getRepository('Anime');

  await animeRepo.save({
    title: 'Cowboy Bebop',
    genres: 'Action, Sci-Fi',
    synopsis: 'Spike and Jet pursue criminals across space...',
    rating: 8.75,
    image: 'https://link.to/image.jpg',
  });

  console.log('Anime inserted!');
}
