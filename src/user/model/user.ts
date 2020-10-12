import { ConflictException } from '@nestjs/common'
import { AggregateRoot } from '@nestjs/cqrs'
import { hash, genSalt } from 'bcrypt'
import { Event } from '@nordfjord/nestjs-cqrs-es'
import { UserRegistered } from '../events/user-registered.event'

export class User extends AggregateRoot<Event> {
  private isRegistered = false
  private email: string
  private passwordHash: string
  constructor(private id: string) {
    super()
  }

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
