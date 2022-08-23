import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UserCotroller } from './users/user.controller';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  userController: UserCotroller;

  constructor(logger: LoggerService, userController: UserCotroller) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  public async init() {
    this.useRoutes();

    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server start on port: ${this.port}`);
    });
  }
}
