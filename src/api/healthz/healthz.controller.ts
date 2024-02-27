import { Controller, Get } from '@nestjs/common';
import { Response } from '../../common/api/response';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Healthz')
export class HealthzController {
  @Get(['/', '/healthz'])
  async getHealthz(): Promise<Response<string>> {
    return {
      result: 'OK',
    };
  }
}
