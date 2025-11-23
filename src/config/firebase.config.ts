import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfigService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: privateKey,
      }),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
    });
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }

  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  getStorage(): admin.storage.Storage {
    return admin.storage();
  }
}
