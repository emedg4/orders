import { DynamicModule, Module } from '@nestjs/common';
import { InformerMicroserviceService } from './informerMs.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [InformerMicroserviceService],
  exports: [InformerMicroserviceService]
})
export class InformerMicroserviceModule {
  static register({ name }: RmqModuleOptions ): DynamicModule {
    return {
      module: InformerMicroserviceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rbmq.url')],
                queue: configService.get<string>('rbmq.informer')
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
