import { tap, timer, withLatestFrom } from 'rxjs';

const timer$ = timer(0, 500);
const timer2$ = timer(0, 2000);
const timer3$ = timer(0, 2500);

timer2$.pipe(
  tap(() => console.log(2)),
  withLatestFrom(
    timer$.pipe(tap(() => console.log(1))),
    // timer3$.pipe(tap(() => console.log(3))),
  ),
).subscribe(resp => console.log(resp));
