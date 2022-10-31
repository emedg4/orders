import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport, RmqContext } from "@nestjs/microservices"
import { ConfigService } from '@nestjs/config';


@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService){}
    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('rbmq.url')],
                queue: this.configService.get<string>('rbmq.queue_name'),
                noAck,
                persistent: true

            }

        }
    }

    ack(context: RmqContext){
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage)

    }
}
