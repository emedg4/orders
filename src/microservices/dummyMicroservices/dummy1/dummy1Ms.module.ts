import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { Dummy1MicroserviceService } from './dummy1Ms.service';

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [Dummy1MicroserviceService],
  exports: [Dummy1MicroserviceService]
})
export class Dummy1MicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: Dummy1MicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.dummy1_queue')
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
