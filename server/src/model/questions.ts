import mongoose, { Document, Model, Schema } from "mongoose";

interface IQuestions extends Document {
  questionName: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new mongoose.Schema(
  {
    questionName: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      trim: true,
    },
  },
  { timestamps: true }
);

const QuestionDetails: Model<IQuestions> = mongoose.model<IQuestions>(
  "QuestionDetails",
  QuestionSchema
);

export default QuestionDetails;
