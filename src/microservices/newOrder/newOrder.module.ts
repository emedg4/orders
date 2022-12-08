import { DynamicModule, Module } from '@nestjs/common';
import { NewOrderService } from './newOrder.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [NewOrderService],
  exports: [NewOrderService]
})
export class NewOrderModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: NewOrderModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.queue.new_order')
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
