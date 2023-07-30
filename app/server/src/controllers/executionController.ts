import express, { Express, NextFunction, Request, Response } from 'express';
import sendMessage from '../config/RabbitMQ';
import Execution from '../models/ExecutionModel';
import getErrorJSON from '../utils/getErrorJSON';

export const execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { src, lang, timeout, input, expectedOutput, user, problem } = req.body;
        if(!src || !lang || !timeout) {
            throw Error(getErrorJSON("Mandatory Params Not Passed", "MANDATORY_PARAMS", 400));
        }
        const execution = await Execution.create({
            src, lang, input, user, problem
        });
        const{ _id } = execution;
        await sendMessage({ src, lang, timeout, input, expectedOutput, executionId: _id });
        let baseUrl = req.get('host');
        res.json({
            success: true,
            message: "Queued for execution",
            executionStatus: `http://${baseUrl}/execute/status/${_id}`
        });
    }
    catch(e) {
        next(e);
    }
}

export const status = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw Error(getErrorJSON("Mandatory Params Not Passed", "MANDATORY_PARAMS", 400));
        }
        const status = await Execution.findById(id);
        if(!status) {
            throw Error(getErrorJSON("Server Error Occurred", "ERROR", 500));
        }
        res.json(JSON.parse(status.status));
    }
    catch(e) {
        next(e);
    }
}