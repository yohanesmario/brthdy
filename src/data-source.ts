import { DataSource } from 'typeorm';
import { Conf } from './config/conf';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: Conf.DB_HOST,
  port: Conf.DB_PORT,
  username: Conf.DB_USERNAME,
  password: Conf.DB_PASSWORD,
  database: Conf.DB_DATABASE,
  entities: Conf.DB_ENTITIES,
  migrations: Conf.DB_MIGRATIONS,
  insecureAuth: true,
});
