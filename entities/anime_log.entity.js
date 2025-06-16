const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'AnimeLog',
    tableName: 'anime_list_log',
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
        created_at: {
            type: "date",
            nullable: true,
            default: new Date()
        }
    },
});
