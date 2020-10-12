import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { RegisterUser } from './command/impl/register-user.command'
import { RegisterUserDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    return await this.commandBus.execute(new RegisterUser(data))
  }
}
