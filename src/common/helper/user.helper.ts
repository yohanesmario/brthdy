import { JobType } from 'src/repository/job/jobType.enum';
import { User } from 'src/repository/user/user.entity';

export class UserHelper {
  static generateBirthdayEmailJobUniqueIdentifier(user: User): string {
    return `${JobType.BIRTHDAY_EMAIL};;USER_ID:${user.id}`;
  }
}
