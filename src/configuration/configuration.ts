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
        url: process.env.RABBITMQ_URL
    },
    db: {
        url: process.env.DB_URL,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        database: process.env.DATABASE
    }
})

