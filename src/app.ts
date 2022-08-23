import express, { Express } from 'express';
import { Server } from 'http';
import { router as usersRouter } from './users/users';

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use(usersRouter);
  }

  public async init() {
    this.useRoutes();

    this.server = this.app.listen(this.port, () => {
      console.log(`Server start on port: ${this.port}`);
    });
  }
}
