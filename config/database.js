import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `Database connected with HOST:`,
        ` ${data.connection.host}`.yellow.bold
      );
    })
    .catch((err) => console.log(err));
};

export default connectDatabase;
