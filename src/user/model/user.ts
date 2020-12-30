import { ConflictException } from '@nestjs/common'
import { hash, genSalt } from 'bcrypt'
import { Event, AggregateRoot } from '@nordfjord/nestjs-cqrs-es'
import { UserRegistered } from '../events/user-registered.event'

export class User extends AggregateRoot<Event> {
  private isRegistered = false
  private email: string
  private passwordHash: string

  async register(email: string, password: string) {
    if (this.isRegistered) throw new ConflictException()

    this.apply(
      new UserRegistered({
        email,
        passwordHash: await hash(password, await genSalt()),
      }),
    )
  }

  onUserRegistered(event: UserRegistered) {
    this.isRegistered = true
    this.email = event.data.email
    this.passwordHash = event.data.passwordHash
  }
}
