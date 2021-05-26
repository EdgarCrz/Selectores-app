import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.eu/rest/v2';

  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];

    // si desestructuramos, basicamente estamos creando una copia identica al original, de esta forma no pasamos por referencia y no afectamos al valor original
    // Esta priopiedad "regiones()" que en si es una funcion o un metodo ya que se encuentra dentro de una class
    // es para llenar la propiedad "regiones" del "selector-page.component.ts"
  }

  //
  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall[]>(url);
  }
  // esta es la peticion http, la cual recibe un parametro "region" y este metodo devolvera un array observable de tipo "PaisSmall"
  // creamos una constante "url" para cargarla con la composicion de la url, la base que esta declarada en la lina 10
  // y le incrustamos nuestro parametro "region" que nos mandan y lo demas solo es el filtro,para indicar que valores del json son los que ocupamos
  // en este caso solo el alpha3code y el nombre

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null);
    }
    const url: string = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
  // Este metodo recibe los borders, si borders viene vacio entonces devuelve un array vacio, esto para que no haya errores ala hora de hacer el match de el tipado
  // si borders si trae informacion, creame un array "peticiones" de tipo observable, y tiene  interface PaisSmall e inicializalo vacio
  // borders claramente es un array, por ende tenemos acceso a todas la funciones que se le pueden implementar a un array
  // lo pasamos por un forEach para ciclarlo tantos indices tenga,  en cada vuelta nos entregara el codigo(recuerda que borders solo trae alpha3Code)
  // una vez tenemos el codigo, ejecutamos una funcion flecha la cual sera: 1 crear una constante "peticion"
  // 2 cargarle la info que nos provea nuestro servicio "getPaisPorCodigoSmall" evidentemente le pasamos el codigo como parametro
  // lo cual nos devolvera un json con el nombre y el alpha3Code despues a la variable "peticiones" le pusheremos la "peticion"
  // por ultimo retorname cada una de las peticiones que se ejecutaron osea todos los valoresque contenga el arrar
}
