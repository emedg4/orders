import { DynamicModule, Module } from '@nestjs/common';
import { Dummy4MicroserviceService } from './dummy4Ms.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [Dummy4MicroserviceService],
  exports: [Dummy4MicroserviceService]
})
export class Dummy4MicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: Dummy4MicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.dummy4_queue')
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
