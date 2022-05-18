import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';
import { PassportModule } from '@nestjs/passport';
import { ErrorService } from 'src/services/error.service';

const passportModule = PassportModule.register({ defaultStrategy: 'bearer' });

@Module({
  imports: [passportModule],
  providers: [FirestoreService, ErrorService],
  exports: [passportModule, FirestoreService],
})
export class SharedModule {}
