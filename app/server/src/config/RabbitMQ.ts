import amqp from "amqplib";
import dotenv from 'dotenv';
dotenv.config();

// interface Message {
//     id: number;
//     text: string;
// }

const sendMessage = async (message: any): Promise<void> => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL!);
        const channel = await connection.createChannel();
        const queueName: string = process.env.RABBITMQ_QUEUE_NAME!;
        await channel.assertQueue(queueName, { durable: false });
        const messageString: string = JSON.stringify(message);
        channel.sendToQueue(queueName, Buffer.from(messageString));
        console.log('Message sent:', messageString);
        await channel.close();
        await connection.close();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
export default sendMessage;