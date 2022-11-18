import { DynamicModule, Module } from '@nestjs/common';
import { Dummy2MicroserviceService } from './dummy2Ms.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [Dummy2MicroserviceService],
  exports: [Dummy2MicroserviceService]
})
export class Dummy2MicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: Dummy2MicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.dummy2_queue')
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
