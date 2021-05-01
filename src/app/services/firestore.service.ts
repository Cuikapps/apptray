import { Injectable } from '@angular/core';
import {
  Action,
  AngularFirestore,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private store: AngularFirestore) {}

  /**
   *
   * @param path
   * @param data
   * @param merge
   *
   * Creates document at specified path and sets it to data, the merge condition specifies to either override existing
   * data or not
   */
  create<T>(path: string, data: T, merge: boolean): void {
    this.store.doc(path).set(data, { merge: merge });
  }

  /**
   *
   * @param path
   * @param subscription if you want to get a observable of document
   * @returns either a promise of an observable or the data
   *
   */
  async read<T>(
    path: string,
    subscription: boolean
  ): Promise<
    T | Observable<Action<DocumentSnapshot<T | undefined>>> | undefined
  > {
    if (subscription) return this.store.doc<T>(path).snapshotChanges();
    else return await (await this.store.doc<T>(path).get().toPromise()).data();
  }

  /**
   *
   * @param path
   * @param data
   */
  update<T>(path: string, data: Partial<T>): void {
    this.store.doc<T>(path).update(data);
  }

  /**
   *
   * @param path
   */
  delete(path: string): void {
    this.store.doc(path).delete();
  }

  genRandID(): string {
    return this.store.createId();
  }
}
