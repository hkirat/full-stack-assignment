import mongoose, { Document, Model, Schema } from "mongoose";

interface IAnswer extends Document {
  answer: string;
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new mongoose.Schema(
  {
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "SignUpDetails",
      trim: true,
    },
    questionId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "QuestionDetails",
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

const AnswerDetails: Model<IAnswer> = mongoose.model<IAnswer>(
  "AnswerDetails",
  AnswerSchema
);

export default AnswerDetails;
