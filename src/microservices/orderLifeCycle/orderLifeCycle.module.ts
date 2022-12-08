import { DynamicModule, Module } from '@nestjs/common';
import { OrderLifeCycleService } from './orderLifeCycle.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [OrderLifeCycleService],
  exports: [OrderLifeCycleService]
})
export class OrderLifeCycleModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: OrderLifeCycleModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.queue.toOrdersEngine')
              },
            }),
            inject: [ConfigService]
          }
        ])
      ],
      exports: [ClientsModule]
    }
  }
}
