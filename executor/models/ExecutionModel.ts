import mongoose, { Schema, Document, Model } from 'mongoose';
interface ExecutionDoc extends Document {
    user: mongoose.Types.ObjectId;
    problem: mongoose.Types.ObjectId;
    src: string;
    lang: string;
    input?: string;
    status: string;
}
const executionSchema: Schema<ExecutionDoc> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    },
    src: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    input: {
        type: String
    },
    status: {
        type: String,
        default: JSON.stringify({ status: "Queued" })
    }
}, {
    timestamps: true
});
const executionModel: Model<ExecutionDoc> = mongoose.model<ExecutionDoc>(
    'Execution',
    executionSchema
);
export default executionModel;