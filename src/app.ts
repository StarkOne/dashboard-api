import express, { Express } from 'express';
import { Server } from 'http';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserCotroller } from './users/user.controller';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  userController: UserCotroller;
  exeptionFilter: ExeptionFilter;

  constructor(logger: LoggerService, userController: UserCotroller, exeptionFilter: ExeptionFilter) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController;
    this.exeptionFilter = exeptionFilter;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionFilters();

    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server start on port: ${this.port}`);
    });
  }
}
