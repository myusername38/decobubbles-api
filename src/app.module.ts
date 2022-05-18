import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { TokenStrategy } from './auth/token.strategy';
import { ControllersModule } from './controllers/controlers.module';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    ControllersModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [TokenStrategy],
})
export class AppModule {
  /*
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(addRawBody).forRoutes('stripe/webhook');
  }
  */
}
