import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';
import MongoDBConnect from './config/Mongo';
import dotenv from 'dotenv';
dotenv.config();
MongoDBConnect();

const app: Express = express();
const PORT: string = process.env.PORT || "5000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*'
}));

import userRoute from './routes/userRoute';
import problemRoute from './routes/problemRoute';
import executionRoute from './routes/executionRoute';
app.use("/user", userRoute);
app.use("/execute", executionRoute);
app.use("/problem", problemRoute);

if (process.env.NODE_ENV === 'PROD') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req: Request, res: Response) =>
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    );
}
else {
    app.get('/', (req: Request, res: Response) => res.send('Please set to production'));
}

app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Express server running on PORT ${PORT}`);
});