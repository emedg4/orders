import { DynamicModule, Module } from '@nestjs/common';
import { Dummy5MicroserviceService } from './dummy5Ms.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [Dummy5MicroserviceService],
  exports: [Dummy5MicroserviceService]
})
export class Dummy5MicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: Dummy5MicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.dummy5_queue')
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
