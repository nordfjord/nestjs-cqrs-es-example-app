import { RegisterUserDto } from 'src/user/dto/register-user.dto';

export class RegisterUser {
  constructor(public readonly data: RegisterUserDto) {}
}
