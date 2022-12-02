import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration'
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MoldModule } from './mold/mold.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/orders'),
  // MongooseModule.forRootAsync({
  //   inject: [ConfigService],
  //   useFactory: async ( configService: ConfigService) => {
  //     uri: configService.get<string>("mongo.uri")
      
  //   }
  // }),
OrdersModule,
MoldModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}

