import mongoose, { Document, Model, Schema } from "mongoose";
interface ProblemDoc extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    testCases: Array<{ input: string; output: string }>;
    createdAt: Date;
    updatedAt: Date;
}
const problemSchema: Schema<ProblemDoc> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    testCases: {
        type: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }],
        required: true
    }
}, {
    timestamps: true
});
const problemModel: Model<ProblemDoc> = mongoose.model<ProblemDoc>(
    "Problem",
    problemSchema
);
export default problemModel;