const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Anime',
  tableName: 'anime_list',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'text',
      nullable: false,
    },
    genres: {
      type: 'text',
      nullable: true,
    },
    synopsis: {
      type: 'text',
      nullable: true,
    },
    rating: {
      type: 'real',
      nullable: true,
    },
    image: {
      type: 'text',
      nullable: true,
    },
  },
});
