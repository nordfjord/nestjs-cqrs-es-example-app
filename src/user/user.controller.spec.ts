import { CqrsModule } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { RegisterUserHandler } from './command/handler/register-user.handler'
import { User } from './model/user'
import { UserController } from './user.controller'
import { TestAggregateRepository } from '@nordfjord/nestjs-cqrs-es'
import { UserRegistered } from './events/user-registered.event'
import { ConflictException } from '@nestjs/common'

describe('UserController', () => {
  let controller: UserController
  let repository: TestAggregateRepository<User>

  beforeEach(async () => {
    const userRepositoryProvider = TestAggregateRepository.forAggregate<User>(
      User,
    )
    repository = userRepositoryProvider.useValue
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [RegisterUserHandler, userRepositoryProvider],
      controllers: [UserController],
    }).compile()

    await module.init()

    controller = module.get<UserController>(UserController)
  })

  it('should register a user', async () => {
    await controller.register({
      email: 'test@example.com',
      password: '12345',
    })

    const events = repository.getEventsFor('test@example.com')

    expect(events).toHaveLength(1)
    expect(events[0]).toBeInstanceOf(UserRegistered)
  })

  it('should disallow repeat registrations', async () => {
    await controller.register({
      email: 'test@example.com',
      password: '12345',
    })
    await expect(
      controller.register({
        email: 'test@example.com',
        password: '12345',
      }),
    ).rejects.toThrowError(ConflictException)
  })
})
