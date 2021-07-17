import { Injectable } from '@angular/core';
import {
  Action,
  AngularFirestore,
  CollectionReference,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(public store: AngularFirestore) {}

  /**
   *
   * Creates document at specified path and sets it to data, the merge condition specifies to either override existing
   * data or not
   */
  create<T>(path: string, data: T, merge: boolean): void {
    this.store.doc(path).set(data, { merge });
  }

  async read<T>(
    path: string,
    subscription: boolean
  ): Promise<
    T | Observable<Action<DocumentSnapshot<T | undefined>>> | undefined
  > {
    if (subscription) {
      return this.store.doc<T>(path).snapshotChanges();
    } else {
      return (await this.store.doc<T>(path).get().toPromise()).data();
    }
  }

  update<T>(path: string, data: Partial<T>): Promise<void> {
    return this.store.doc<T>(path).update(data);
  }

  delete(path: string): void {
    this.store.doc(path).delete();
  }

  genRandID(): string {
    return this.store.createId();
  }

  collection<T>(name: string): CollectionReference<T> {
    return this.store.collection<T>(name).ref;
  }
}
