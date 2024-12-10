const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const app = express();

const userPackageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../proto", "user.proto"),
  {
    keepCase: true,
    longs: String,
    defaults: true,
    oneofs: true,
  }
);

const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/create-user", (req, res) => {
  try {
    const { user } = req.body;
    const userClinet = new userProto.CreateUser(
      "localhost:50051",
      grpc.credentials.createInsecure()
    );
    userClinet.createUser({ user }, (err, response) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(response.user);
        res.send(response.user);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(3001, () => {
  console.log(`Express server running on http://localhost:${3001}`);
});
