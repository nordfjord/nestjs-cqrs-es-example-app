import { Event, ExpectedVersion } from '@nordfjord/nestjs-cqrs-es'
import { UserRegisteredDto } from '../dto/user-registered.dto'

export class UserRegistered extends Event<UserRegisteredDto> {
  constructor(data: UserRegisteredDto) {
    super(`User-${data.email}`, data, ExpectedVersion.noStream)
  }
}
