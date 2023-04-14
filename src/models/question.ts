import { model, Schema, Document, Collection } from "mongoose";

interface Testcase {
  input: string[];
  output: string[];
}

interface IQuestion extends Document {
  title: string;
  statement: string;
  testcases: Testcase[];
}

// Scheme for Questions collections
const questionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
    },
    statement: {
      type: String,
      required: true,
    },
    testcases: [
      {
        input: [String],
        output: [String],
      },
    ],
  },
  {
    timestamps: true, // To automatically add `createdAt` and `updatedAt` fields
    versionKey: false, // `__v` attribute in mongodb will not be added
  }
);

// Create the model
const Question = model<IQuestion>("Question", questionSchema);
export default Question;
