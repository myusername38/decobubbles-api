import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';
import { PassportModule } from '@nestjs/passport';

const passportModule = PassportModule.register({ defaultStrategy: 'bearer' });

@Module({
  imports: [passportModule],
  providers: [FirestoreService],
  exports: [passportModule, FirestoreService],
})
export class SharedModule {}
