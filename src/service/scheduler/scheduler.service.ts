import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Job } from 'src/repository/job/job.entity';
import { JobStatus } from 'src/repository/job/jobStatus.enum';
import {
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserService } from '../user/user.service';
import { JobType } from 'src/repository/job/jobType.enum';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EmailService } from '../email/email.service';
import { DateHelper } from 'src/common/helper/date.helper';
import { randomUUID } from 'crypto';
import { Conf } from 'src/config/conf';

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerService.name);
  private executorMap = new Map<number, NodeJS.Timeout>();
  private executorId = randomUUID();

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private userService: UserService,
    private emailService: EmailService,
  ) {
    this.logger.log(`[EXECUTOR_ID] ${this.executorId}`);
  }

  // @Cron('0 */5 * * * *')
  @Cron(Conf.SCHEDULER_CRON)
  async fetchJob() {
    let now = moment();
    let jobs = await this.jobRepository.findBy([
      {
        status: JobStatus.SCHEDULED,
        scheduledTime: LessThanOrEqual(now.toDate()),
      },
      {
        status: JobStatus.PROCESSING,
        lastAccessTime: LessThanOrEqual(now.subtract(10, 'minutes').toDate()),
      },
    ]);
    await this.scheduleJobExecution(jobs);
    if (jobs.length > 0) {
      this.logger.log(
        `[SCHEDULER] [EXECUTING_JOBS] ${JSON.stringify(jobs.map((job) => job.id))}`,
      );
    }
  }

  private async scheduleJobExecution(jobs: Job[]) {
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      switch (job.type) {
        case JobType.BIRTHDAY_EMAIL:
          if (job.refId != null) {
            if (this.executorMap.get(job.refId) == null) {
              this.executorMap.set(
                job.refId,
                setTimeout(async () => {
                  try {
                    await this.runBirthdayEmailJob(job);
                  } catch (e) {
                    this.logger.error(`[SCHEDULER] [UNKNOWN_ERROR] ${e}`);
                  }
                  if (job.refId != null) {
                    this.executorMap.delete(job.refId);
                  }
                }, 100),
              );
            }
          }
          break;
      }
    }
  }

  async runBirthdayEmailJob(job: Job) {
    let now = moment();
    let partialEntity: QueryDeepPartialEntity<Job> = {
      accessorId: this.executorId,
      status: JobStatus.PROCESSING,
      lastAccessTime: now.toDate(),
    };
    let acquiredJobs = (
      await Promise.all([
        await this.jobRepository.update(
          {
            id: job.id,
            status: JobStatus.SCHEDULED,
          },
          partialEntity,
        ),
        await this.jobRepository.update(
          {
            id: job.id,
            status: JobStatus.PROCESSING,
            lastAccessTime: LessThanOrEqual(
              now.subtract(10, 'minutes').toDate(),
            ),
          },
          partialEntity,
        ),
      ])
    )
      .map((updateResult) => {
        return updateResult.affected || 0;
      })
      .reduce((a, b) => {
        return a + b;
      });

    if (acquiredJobs > 0) {
      // Acquire job successful. Execute
      if (job.refId != null) {
        let userId = job.refId;
        let user = await this.userService.getUserById(userId);
        if (user != null) {
          let error = await this.emailService.sendEmail(
            user.email,
            `Happy birthday dear ${user.firstName.trim()} ${user.lastName.trim()}!`,
          );

          if (error == null) {
            this.jobRepository.manager.transaction(async (entityManager) => {
              if (user != null) {
                // await entityManager.delete(Job, {
                //   id: job.id,
                //   accessorId: this.executorId,
                //   status: JobStatus.PROCESSING
                // })
                let birthdayEmailJobData: BirthdayEmailJobData = {
                  userId: user.id,
                };
                let nextJob = entityManager.create(Job);
                nextJob.id = job.id;
                nextJob.type = JobType.BIRTHDAY_EMAIL;
                nextJob.value = JSON.stringify(birthdayEmailJobData);
                nextJob.refTable = job.refTable;
                nextJob.refId = job.refId;
                nextJob.status = JobStatus.SCHEDULED;
                nextJob.uniqueIdentifier = job.uniqueIdentifier;
                nextJob.scheduledTime = new Date(
                  DateHelper.getNextBirthdayTimestamp(
                    user.birthdayDate,
                    user.localTimezone,
                  ),
                );
                await entityManager.save(nextJob);
              }
            });
          } else {
            this.logger.error(
              `[SEND_BIRTHDAY_EMAIL] [UNKNOWN_ERROR] ${error.name} ${error.message}`,
              error.stack,
            );
          }
        }
      }
    }
  }
}
