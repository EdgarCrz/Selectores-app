import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // Llenar selectores

  regiones: string[] = [];

  paises: PaisSmall[] = [];

  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}
  // FormBuilder, es para que cree AbstractControls a partir de nuestras configuraciones,
  // basicamente para poder acceder a las propiedades de los inputs a los controls(value, valid, parent, disabled, errors... y los demas)

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // ojo diferencia cual regiones es cual,  en la linea 22 tenemos un array "regiones" vacio el cual en la 31
    // estamos cargando con la propiedad de nuestro servicio directo desde "this.paisService.regiones"

    // cuando cambia la region
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;

        // console.log(paises);
      });
    // trae la propiedad 'region' y esta al pendiente de sus cambios ? si existen agregamos un tal para un evento secundario
    // vamos a recibir la region pero no nos interesa omitela con ( _ ), accedemos a mi formulario en 'pais'
    // y hacemos un reset dejando el valor vacio
    // ahora si regresamos a lo principal, recibimos la region y con el switchmap vamos a transformarlo
    // ejecutamos una funcion flecha, ejecutamos el servicio "getPaisPorRegion0"  y le pasamos como parametro la region
    // nos devolvera un observable enforma PaisSmall y nos suscribimos a esa respuesta por ultimo asignamos a nuestra propiedad local paises
    // le asiganos los paises que vienen del service

    // cuando cambia el pais

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        // tap:efectos secundarios
        switchMap((codigo) => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap((pais) =>
          this.paisesService.getPaisesPorCodigos(pais?.borders!)
        )
        // switchMap: transformacion de un resultado en otro observable o simplemente en otra cosa si no resuelve observable
      )
      .subscribe((paises) => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      });

    // se sabe que 'pais' se vincula al code por el html ahi se asigna el value del alpha3code
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}

//  cuando cambie la region
// este codigo fue optimizado
// this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
//   console.log(region);

//   this.paisesService.getPaisesPorRegion(region).subscribe((paises) => {
//     console.log(paises);
//     this.paises = paises;
//   });
// });

// explicacion:
// checar que estos scripts se encuentran dentro del onInit lo cual significa que cargaran en automatico cuando el sitio carge
// this.miFormulario.get('region') de mi propiedad mi formulario get/traeme el valor 'region'
//  (?/si es que existe) .valueChanges(esta funcion devuelve un observable)/muestrame, los cambios que tenga ese campo .subscribe
// recibira como parametro el cambio(en este caso la region) y la cargara como parametro para lo que ejecute el .subscribe,
// con el subscribe en cuanto se active ejecuta una funcion flecha, primero imprime en consola el valor de la region
// despues accedemos a nuestro servicio/a su metodo "getPaisesPorRegion()" y le mandamos nuestra parametro region
// de nuevo nos suscribimos a lo que nos devuelva este metodo y en este caso nos devolveran "paises" y de igual manera se imprimen en consola
// nuestra propiedad  "paises" de la linea 21 se cargara con lo que nos devuelve  "getPaisesPorRegion"
