import { Document, model, Schema } from 'mongoose';

// Define the supported languages for the app
enum LanguageEnum {
  'javascript' = 'javascript',
  'python' = 'python',
  'java' = 'java',
  'c' = 'c',
};

// Define the schema for the language model
export interface ILanguage extends Document {
  name: LanguageEnum;
};

const languageSchema = new Schema<ILanguage>({
  name: {
    type: String,
    enum: Object.values(LanguageEnum),
    unique: true,
    required: true,
  },
}, {
  timestamps: true, // To automatically add `createdAt` and `updatedAt` fields
});

// Export the language model
const Language = model<ILanguage>('Language', languageSchema);
export default Language;
