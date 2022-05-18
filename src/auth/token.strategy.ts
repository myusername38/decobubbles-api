import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly firestoreService: FirestoreService) {
    super();
  }

  async validate(token): Promise<DecodedIdToken> {
    try {
      const decodedToken: DecodedIdToken =
        await this.firestoreService.verifyToken(token);
      if (decodedToken) {
        return decodedToken;
      }
      throw new HttpException('Authentication error', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      throw new HttpException('Authentication error', HttpStatus.UNAUTHORIZED);
    }
  }
}
