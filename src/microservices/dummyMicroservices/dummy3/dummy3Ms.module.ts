import { DynamicModule, Module } from '@nestjs/common';
import { Dummy3MicroserviceService } from './dummy3Ms.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [Dummy3MicroserviceService],
  exports: [Dummy3MicroserviceService]
})
export class Dummy3MicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: Dummy3MicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.dummy3_queue')
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
