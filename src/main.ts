import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserCotroller } from './users/user.controller';

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(logger, new UserCotroller(logger));
  await app.init();
}

bootstrap();
