export default () => ({
    app : {
        port: process.env.APP_PORT
    },
    rbmq: {
        user: process.env.RABBITMQ_USER,
        pass: process.env.RABBITMQ_PASSWORD,
        host: process.env.RABBITMQ_HOST,
        new_order_queue: process.env.NEW_ORDER_QUEUE,
        list_orders_queue: process.env.LIST_ORDERS_QUEUE,
        modify_order_queue: process.env.MODIFY_ORDER_QUEUE,
        unpaid_orders_queue: process.env.UNPAID_ORDERS_QUEUE,
        url: process.env.RABBITMQ_URL,
        dummy1_queue: process.env.QUEUE_DUMMY_ONE,
        dummy2_queue: process.env.QUEUE_DUMMY_TWO,
        dummy3_queue: process.env.QUEUE_DUMMY_THREE,
        dummy4_queue: process.env.QUEUE_DUMMY_FOUR,
        dummy5_queue: process.env.QUEUE_DUMMY_FIVE,
        informer: process.env.INFORMER_QUEUE,
    },
    mongo: {
        uri: process.env.MONGO_URI

    }
})

