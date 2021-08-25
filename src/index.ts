import express from 'express';
import { concat, from, Observable, of, Subscriber } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { usuarios } from './data';

const app = express();

function subscribe(subscriber: Subscriber<any>) {
  for (let usuario of usuarios) {
    subscriber.next(usuario);
  }
}

// 1
let usuarios1$ = new Observable(subscribe);

// 2
let usuarios2$ = new Observable(subscriber => {

  for (let usuario of usuarios) {
    if (!usuario.sobrenome) {
      subscriber.error('Usuário sem sobrenome');
    }

    subscriber.next(usuario);
  }

  setTimeout(() => {
    // Esse next() não será recebido pelo subscribe, pois será emitido após o método complete()
    subscriber.next({ nome: 'Teste', sobrenome: 'dos Santos' });
  }, 3000);

  setTimeout(() => {
    subscriber.complete();
  }, 2000);

  return () => console.log('Terminou de executar');
});

usuarios1$.subscribe((usuario: any) => console.log('observable1: ', usuario.nome));
usuarios2$.subscribe((usuario: any) => console.log('observable2: ', usuario.nome));
usuarios2$.subscribe({ next: (usuario: any) => console.log('observable3: ', usuario.nome) }); // uma outra forma de fazer, esse next chamará o next() da linha 25

/***************************/

let source1$ = of('Olá, Mundo', 10, true, usuarios[0].nome);
source1$.subscribe(value => console.log('of: ', value));

let source2$ = from(usuarios);
source2$.subscribe(value => console.log('from: ', value));

concat(source1$, source2$).subscribe(value => console.log('concat: ', value), err => err);

/**************************/

of('https://cgcnode.herokuapp.com/somar?a=1&b=2').subscribe(value => {
  global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; // para o ajax() funcionar

  ajax(value).subscribe({
    next: (resp) => console.log('ajax: ', resp),
    error: (err) => console.log('ajax erro:', err.message)
  });
});

app.listen(3333);
