const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

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

const userModel = [];

function createUser(call, callback) {
  const { user } = call.request;

  userModel.push(user);
  const replay = {
    message: "user created",
    user: { name: user.name, email: user.email },
  };
  callback(null, replay);
}

const server = new grpc.Server();

server.addService(userProto.CreateUser.service, { createUser });

const grpcPort = "50051";

server.bindAsync(
  `0.0.0.0:${grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server running on port ${grpcPort}`);
    server.start();
  }
);
