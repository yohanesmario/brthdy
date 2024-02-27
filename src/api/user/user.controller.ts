import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'src/common/api/response';
import { User } from 'src/repository/user/user.entity';
import { UserService } from 'src/service/user/user.service';

class UserRequestPayload {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthdayDate: string;

  @ApiProperty()
  birthdayLocation: string;

  @ApiProperty()
  localTimezone: string;
}

class CreateUserResponsePayload {
  @ApiProperty()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user')
  @ApiOperation({ description: 'Create new user' })
  @ApiResponse({ status: 200, description: 'Created' })
  async createNewUser(
    @Body() requestPayload: UserRequestPayload,
  ): Promise<Response<CreateUserResponsePayload>> {
    let user = new User();
    user.firstName = requestPayload.firstName;
    user.lastName = requestPayload.lastName;
    user.email = requestPayload.email;
    user.birthdayDate = requestPayload.birthdayDate;
    user.birthdayLocation = requestPayload.birthdayLocation;
    user.localTimezone = requestPayload.localTimezone;
    let createdUser = await this.userService.upsertUser(user);
    return {
      result: new CreateUserResponsePayload(createdUser.id),
    };
  }

  @Delete('/user/:id')
  async deleteUser(@Param() params: any): Promise<Response<string>> {
    let userId: number = params.id;
    let error = await this.userService.deleteUser(userId);

    if (error != null) {
      throw error;
    }

    return {
      result: 'OK',
    };
  }

  @Put('/user/:id')
  async updateUser(
    @Param() params: any,
    @Body() requestPayload: UserRequestPayload,
  ): Promise<Response<string>> {
    let userId: number = params.id;
    let user = new User();
    user.firstName = requestPayload.firstName;
    user.lastName = requestPayload.lastName;
    user.email = requestPayload.email;
    user.birthdayDate = requestPayload.birthdayDate;
    user.birthdayLocation = requestPayload.birthdayLocation;
    user.localTimezone = requestPayload.localTimezone;
    await this.userService.upsertUser(user, userId);
    return {
      result: 'OK',
    };
  }
}
