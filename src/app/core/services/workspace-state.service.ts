import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceStateService {
  readonly isDirty$ = new BehaviorSubject<boolean>(false);

  setDirty(value: boolean): void {
    this.isDirty$.next(value);
  }
}
