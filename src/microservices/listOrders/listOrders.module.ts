import { DynamicModule, Module } from '@nestjs/common';
import { ListOrdersService } from './listOrders.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [ListOrdersService],
  exports: [ListOrdersService]
})
export class ListOrdersModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: ListOrdersModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.queue.list_orders')
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
