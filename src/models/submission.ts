import { PopulatedDoc, Document, Schema, model } from 'mongoose';
import { IQuestion } from './question';
import { IUser } from './user';

// Interface for Submission document
export interface ISubmission extends Document {
  questionId: PopulatedDoc<IQuestion & Document>;
  userId: PopulatedDoc<IUser & Document>;
  code: string;
  language: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  output?: string;
  error?: string;
}

// Submission Schema
const submissionSchema = new Schema<ISubmission>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
    output: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true, // To automatically add `createdAt` and `updatedAt` fields
    versionKey: false, // `__v` attribute in mongodb will not be added
  }
);

// Export the Submission model
const Submission = model<ISubmission>('Submission', submissionSchema);
export default Submission;

