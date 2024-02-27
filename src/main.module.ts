import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conf } from './config/conf';
import { User } from './repository/user/user.entity';
import { Job } from './repository/job/job.entity';
import { UserService } from './service/user/user.service';
import { SchedulerService } from './service/scheduler/scheduler.service';
import { EmailService } from './service/email/email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthzController } from './api/healthz/healthz.controller';
import { UserController } from './api/user/user.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Conf.DB_HOST,
      port: Conf.DB_PORT,
      username: Conf.DB_USERNAME,
      password: Conf.DB_PASSWORD,
      database: Conf.DB_DATABASE,
      entities: Conf.DB_ENTITIES,
      insecureAuth: true,
    }),
    TypeOrmModule.forFeature([User, Job]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [HealthzController, UserController],
  providers: [UserService, SchedulerService, EmailService],
})
export class AppModule {}
