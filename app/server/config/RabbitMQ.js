const amqp = require("amqplib");
require("dotenv").config();
const sendMessage = async (message) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = process.env.RABBITMQ_QUEUE_NAME;
        await channel.assertQueue(queue, { durable: false });
        const messageString = JSON.stringify(message);
        channel.sendToQueue(queue, Buffer.from(messageString));
        console.log('Message sent:', messageString);
        await channel.close();
        await connection.close();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
module.exports = sendMessage;