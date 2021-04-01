import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Event, EventStore, EventStoreModule } from '@nordfjord/nestjs-cqrs-es';
import { CqrsModule, EventBus } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forRoot({
      connection: {
        defaultUserCredentials: { username: 'admin', password: 'changeit' },
      },
      tcpEndpoint: 'tcp://127.0.0.1:1113',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
