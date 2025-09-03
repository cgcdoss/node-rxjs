import express from 'express';
import { concat, from, Observable, of, Subscriber } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, map, retry, tap } from 'rxjs/operators';
import { usuarios } from './data';
import { XMLHttpRequest } from 'xmlhttprequest';

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
  ajax(value).subscribe({
    next: (resp) => console.log('ajax: ', resp),
    error: (err) => console.log('ajax erro:', err.message)
  });
});

/**************************/

let newUsers = [];
from(usuarios)
  .pipe(
    // debounceTime(500), // adiciona um tempo de espera para caso seja emitido um novo next() no Observable, muito útil quando é utilizado em inputs autocompletes
    retry(4), // fará 4 tentativas, caso haja falha na requisição
    tap(usuario => newUsers.push(usuario)), // usado quando se deseja alterar o estado externo (chamar uma function ou setar valor em uma propriedade externa), sem alterar o conteúdo do Observable
    map(usuario => usuario.nome), // usado quande se deseja alterar o conteúdo do Observable, nesse caso o Observable deixou de ser de Usuario e passou a ser de string
  ).subscribe(value => console.log('operadores: ', value));


app.listen(3333);
