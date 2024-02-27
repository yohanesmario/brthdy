import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { error } from 'console';
import { request } from 'https';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(private httpService: HttpService) {}

  async sendEmail(to: string, body: string): Promise<Error | null | undefined> {
    try {
      let data = {
        email: to,
        message: body,
      };
      let result = await firstValueFrom(
        this.httpService
          .post('https://email-service.digitalenvision.com.au/send-email', data)
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );
      this.logger.log(
        `[EMAIL_SERVICE] [SENT] request=${JSON.stringify(data)} response=${JSON.stringify(result.data)}`,
      );
    } catch (e) {
      return Error(`${e}`);
    }
    return undefined;
  }
}
