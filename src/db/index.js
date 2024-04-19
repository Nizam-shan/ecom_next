import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDb = async () => {
  const connectionUrl =
    "mongodb+srv://shannizam111:Nizam123@cluster0.9xtk4kh.mongodb.net/";

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("e-com database connected"))
    .catch((error) => console.log("Error connecting", error));
};

export default connectDb;
