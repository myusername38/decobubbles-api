import { Injectable } from '@nestjs/common';
import { DocumentData, Firestore } from '@google-cloud/firestore';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import {
  CollectionQuery,
  LimitQuery,
  OrderQuery,
  QueryType,
  WhereQuery,
} from 'src/interfaces/firebase/collection-query';
import * as admin from 'firebase-admin';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { CustomClaims } from 'src/interfaces/users/custom-claims';
import { config } from '../secrets/config';
import { LoginDto } from 'src/dtos/login.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { RegisterDto } from 'src/dtos/register.dto';

@Injectable()
export class FirestoreService {
  private readonly ACTION_CODE_PATH = 'action_codes';
  private auth;
  private db: Firestore = null;

  constructor() {
    initializeApp(config);
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    this.db = admin.firestore();
  }

  async verifyToken(token: string): Promise<DecodedIdToken> {
    return await admin.auth().verifyIdToken(token, true);
  }

  async login(loginDto: LoginDto) {
    const auth = getAuth();
    const data = await signInWithEmailAndPassword(
      auth,
      loginDto.email,
      loginDto.password,
    );
    const token = await data.user.getIdToken();
    return { token };
  }

  async getUserCustomClaims(uid: string): Promise<CustomClaims> {
    return (await admin.auth().getUser(uid)).customClaims as CustomClaims;
  }

  async setUserCustomClaims(uid: string, customClaims): Promise<void> {
    return await admin.auth().setCustomUserClaims(uid, customClaims);
  }

  async revokeRefreshToken(uid: string): Promise<void> {
    return await admin.auth().revokeRefreshTokens(uid);
  }

  async getUserByEmail(email: string): Promise<UserRecord> {
    return await admin.auth().getUserByEmail(email);
  }

  public async deleteAccount(uid: string) {
    return await Promise.all([
      admin.auth().deleteUser(uid),
      this.revokeRefreshToken(uid),
    ]);
  }

  async register(registerDto: RegisterDto): Promise<string> {
    const auth = getAuth();
    const user = await createUserWithEmailAndPassword(
      auth,
      registerDto.email,
      registerDto.password,
    );
    return user.user.uid;
  }

  private queryBuilder(
    queries: CollectionQuery[],
    base: FirebaseFirestore.CollectionReference,
  ): FirebaseFirestore.Query<DocumentData> {
    if (!queries || queries.length === 0) {
      return base;
    }
    let buildQuery: FirebaseFirestore.Query<DocumentData>;
    queries.forEach((query) => {
      const ref = buildQuery ? buildQuery : base;
      switch (query.type) {
        case QueryType.where:
          const whereQuery: WhereQuery = query as WhereQuery;
          buildQuery = ref.where(
            whereQuery.field,
            whereQuery.queryType,
            whereQuery.value,
          );
          break;
        case QueryType.limit:
          const limitQuery: LimitQuery = query as LimitQuery;
          buildQuery = ref.limit(limitQuery.limit);
          break;
        case QueryType.orderBy:
          const orderQuery: OrderQuery = query as OrderQuery;
          const dir: admin.firestore.OrderByDirection = orderQuery.orderBy
            ? orderQuery.orderBy
            : 'asc';
          buildQuery = ref.orderBy(orderQuery.field, dir);
          break;
      }
    });
    return buildQuery;
  }
}
