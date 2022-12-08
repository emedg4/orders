export default () => ({
    app : {
        port: process.env.APP_PORT
    },
    rbmq: {
        user: process.env.RABBITMQ_USER,
        pass: process.env.RABBITMQ_PASSWORD,
        host: process.env.RABBITMQ_HOST,
        url: process.env.RABBITMQ_URL,
        queue: {
            new_order: process.env.NEW_ORDER_QUEUE,
            list_orders: process.env.LIST_ORDERS_QUEUE,
            modify_order: process.env.MODIFY_ORDER_QUEUE,
            unpaid_orders: process.env.UNPAID_ORDERS_QUEUE,
            informer: process.env.INFORMER_QUEUE,
        }

        
    },
    mongo: {
        uri: process.env.MONGO_URI

    }
})

