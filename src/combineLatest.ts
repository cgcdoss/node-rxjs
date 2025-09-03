import { combineLatest, tap, timer } from 'rxjs';

const timer$ = timer(0, 1000);
const timer2$ = timer(0, 1500);

combineLatest([
  timer$.pipe(tap(() => console.log(1))),
  timer2$.pipe(tap(() => console.log(2))),
]).subscribe(resp => console.log(resp));
