require('reflect-metadata');
const { DataSource } = require('typeorm');
const AnimeEntity = require('../entities/anime.entity');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'adamramdaniyunus',
  password: '',
  database: 'big_data_api',
  synchronize: true, // false di production
  logging: false,
  entities: [
    AnimeEntity
  ],
});

module.exports = { AppDataSource };