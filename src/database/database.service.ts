import { Injectable } from '@nestjs/common';
import { FirebaseConfigService } from '../config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
export class DatabaseService {
  private db: admin.firestore.Firestore;

  constructor(private firebaseConfig: FirebaseConfigService) {
    this.db = this.firebaseConfig.getFirestore();
  }

  // Generic CRUD operations
  async create<T>(collection: string, data: T, id?: string): Promise<{ id: string; data: T }> {
    const docData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (id) {
      await this.db.collection(collection).doc(id).set(docData);
      return { id, data: docData as T };
    } else {
      const docRef = await this.db.collection(collection).add(docData);
      return { id: docRef.id, data: docData as T };
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const doc = await this.db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as T;
  }

  async findOne<T>(collection: string, field: string, value: any): Promise<T | null> {
    const snapshot = await this.db
      .collection(collection)
      .where(field, '==', value)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as T;
  }

  async findAll<T>(collection: string, filters?: { field: string; operator: admin.firestore.WhereFilterOp; value: any }[]): Promise<T[]> {
    let query: admin.firestore.Query = this.db.collection(collection);

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        query = query.where(filter.field, filter.operator, filter.value);
      });
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await this.db.collection(collection).doc(id).update(updateData);
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).delete();
  }

  async batchWrite(operations: Array<{ type: 'create' | 'update' | 'delete'; collection: string; id?: string; data?: any }>): Promise<void> {
    const batch = this.db.batch();

    operations.forEach((op) => {
      const docRef = op.id ? this.db.collection(op.collection).doc(op.id) : this.db.collection(op.collection).doc();

      switch (op.type) {
        case 'create':
          batch.set(docRef, {
            ...op.data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          break;
        case 'update':
          batch.update(docRef, {
            ...op.data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  }

  // Transaction support
  async runTransaction<T>(updateFunction: (transaction: admin.firestore.Transaction) => Promise<T>): Promise<T> {
    return this.db.runTransaction(updateFunction);
  }

  // Get Firestore instance for advanced queries
  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }

  // Collection reference
  collection(name: string): admin.firestore.CollectionReference {
    return this.db.collection(name);
  }
}
