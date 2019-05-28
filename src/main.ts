import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// import { ExpressAdapter } from "@nestjs/platform-express";
import { ApplicationModule } from "./app.module";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as serverless from "azure-function-express";
// import * as express from "express";

async function bootstrap() {
  // const expressApp = express();
  // const adapter = new ExpressAdapter(expressApp);
  // return NestFactory.create(ApplicationModule, adapter)
  //   .then(app => app.enableCors())
  //   .then(app => app.init())
  //   .then(() => serverless.createHandler(expressApp));
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

const index: AzureFunction = async function(
  context: Context,
  req: HttpRequest
) {
  context.log("JavaScript HTTP trigger function processed a request.");

  bootstrap().then(server => {
    return serverless.proxy(server, req, context);
  });

  // if (req.query.name || (req.body && req.body.name)) {
  //   context.res = {
  //     status: "200",
  //     body: "Hello " + (req.query.name || req.body.name)
  //   };
  // } else {
  //   context.res = {
  //     status: 400,
  //     body: "Please pass a name on the query string or in the request body"
  //   };
  // }
};

// export { index };