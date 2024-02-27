import { Job } from '../repository/job/job.entity';
import { User } from '../repository/user/user.entity';

export class Conf {
  static DB_HOST: string = process.env.DB_HOST || 'localhost';
  static DB_PORT: number = parseInt(process.env.PORT || '3306', 10);
  static DB_USERNAME: string = process.env.DB_USERNAME || 'brthdy';
  static DB_PASSWORD: string = process.env.DB_PASSWORD || 'brthdy';
  static DB_DATABASE: string = process.env.DB_DATABASE || 'brthdy';
  static DB_ENTITIES: Function[] = [User, Job];
  static DB_MIGRATIONS: string[] = ['src/migration/*.ts'];

  static SCHEDULER_CRON: string = process.env.SCHEDULER_CRON || '* * * * * *';
}
