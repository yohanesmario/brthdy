import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-timezone';
import { DateHelper } from 'src/common/helper/date.helper';
import { UserHelper } from 'src/common/helper/user.helper';
import { Job } from 'src/repository/job/job.entity';
import { JobType } from 'src/repository/job/jobType.enum';
import { User } from 'src/repository/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  async upsertUser(user: User, id?: number): Promise<User> {
    let existingUser = id != null ? await this.getUserById(id) : null;
    if (id != null) {
      if (existingUser == null) {
        throw new Error(`user id ${id} not found`);
      }
      await this.userRepository.update({ id: id }, user);
    } else {
      await this.userRepository.save(user);
    }
    let upsertedUser = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (upsertedUser == null) {
      throw `failed to upsert user ${JSON.stringify(user)}`;
    }
    if (
      upsertedUser != null &&
      existingUser?.birthdayDate != upsertedUser.birthdayDate
    ) {
      await this.upsertUserSideEffect(upsertedUser);
    }
    return upsertedUser;
  }

  async deleteUser(id: number): Promise<Error | null | undefined> {
    let result = await this.userRepository.delete({ id: id });
    if (result.affected != null && result.affected > 0) {
      await this.deleteUserSideEffect(id);
    }
    if (result.affected == null || result.affected <= 0) {
      return new Error(`user id ${id} not found`);
    }
    return undefined;
  }

  private async upsertUserSideEffect(user: User) {
    let birthdayEmailJobData: BirthdayEmailJobData = {
      userId: user.id,
    };
    let job = this.jobRepository.create();
    job.type = JobType.BIRTHDAY_EMAIL;
    job.value = JSON.stringify(birthdayEmailJobData);
    job.refTable = this.userRepository.metadata.tableName;
    job.refId = user.id;
    job.uniqueIdentifier =
      UserHelper.generateBirthdayEmailJobUniqueIdentifier(user);
    job.scheduledTime = new Date(
      DateHelper.getNextBirthdayTimestamp(
        user.birthdayDate,
        user.localTimezone,
      ),
    );
    await this.jobRepository.save(job);
  }

  private async deleteUserSideEffect(userId: number) {
    await this.jobRepository.delete({
      refTable: this.userRepository.metadata.tableName,
      refId: userId,
    });
  }
}
