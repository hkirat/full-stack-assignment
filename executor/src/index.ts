import amqp from 'amqplib';
import MongoDBConnect from './config/Mongo';
import dotenv from 'dotenv';
import _ from 'lodash';
import { execute } from "./execute";
import Execution from './models/ExecutionModel';
dotenv.config();

const consumeMessages = async () => {
    await MongoDBConnect();
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL!);
        const channel = await connection.createChannel();
        const queue = process.env.RABBITMQ_QUEUE_NAME!;
        await channel.assertQueue(queue, { durable: false });
        console.log('Waiting for messages...');
        channel.consume(queue, async (message) => {
            const messageContent = _.get(message, 'content', null);
            if(message && messageContent) {
                const messageString = messageContent.toString();
                const receivedMessage = JSON.parse(messageString);
                console.log({receivedMessage})
                const { executionId } = receivedMessage;
                try {
                    const executionResult = await execute(
                        receivedMessage.src,
                        receivedMessage.lang,
                        receivedMessage.timeout,
                        receivedMessage.input,
                        receivedMessage.expectedOutput
                    );
                    let { message, info, time, memory, output, verdict } = executionResult;
                    await Execution.findByIdAndUpdate(executionId, { status: JSON.stringify({ status: "Done", message, info, time, memory, output, verdict }) });
                }
                catch(e) {
                    console.log("Error in execution: ", e);
                }
                channel.ack(message);
            }
        });
    }
    catch (error) {
        console.error('Error: ', error);
    }
}
consumeMessages().catch(console.error);