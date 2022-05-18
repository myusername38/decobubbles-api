import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TokenStrategy } from './token.strategy';

@Module({
  imports: [SharedModule],
  providers: [TokenStrategy],
  exports: [],
})
export class AuthModule {}
