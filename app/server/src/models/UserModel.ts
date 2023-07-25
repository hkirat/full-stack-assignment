import mongoose, { Document, Model, Schema } from "mongoose";
interface UserDoc extends Document {
    name: string;
    email: string;
    password: string;
    roles: Array<string>;
    createdAt: Date;
    updatedAt: Date;
}
const userModelSchema: Schema<UserDoc> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
        default: ['user']
    }
}, {
    timestamps: true
});
const UserModel: Model<UserDoc> = mongoose.model<UserDoc>(
    "User",
    userModelSchema
);
export default UserModel;