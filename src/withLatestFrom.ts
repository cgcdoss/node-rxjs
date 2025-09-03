import { tap, timer, withLatestFrom } from 'rxjs';

const timer$ = timer(0, 1000);
const timer2$ = timer(0, 2000);

timer2$.pipe(
  tap(() => console.log(2)),
  withLatestFrom(timer$.pipe(tap(() => console.log(1)))),
).subscribe(resp => console.log(resp));
