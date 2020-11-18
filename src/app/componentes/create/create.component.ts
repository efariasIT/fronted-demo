import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ServicioService } from '../../servicios/servicio.service';
import { Person } from '../../models/person.class';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 0 }),
        animate('2ms', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class CreateComponent implements OnInit {

  // Variables
  public formCES: FormGroup;
  nuevaPersona: Person;
  existDocument = false;

  tipoGenero = [
    { id: 'M', value: 'Maculino' },
    { id: 'F', value: 'Femenino' },
  ];

  tipoPersona = [
    { id: 'C', value: 'Hijo' },
    { id: 'F', value: 'Padre' },
    { id: 'M', value: 'Madre' },
  ];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private titleService: Title,
              private service: ServicioService,
              public dialog: MatDialog) {

    this.titleService.setTitle('Fronted Angular');
    this.formCES = new FormGroup({});

  }

  /**
   * Método de inicialización.
   * @returns void
   */
  ngOnInit(): void {
    // Incialización validaciones de formulario
    this.validacionesFormulario();
  }

  /**
   * Validación de formulario
   * @returns void
   */
  validacionesFormulario(): void {
    this.formCES = this.formBuilder.group({
      documento: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(5), Validators.maxLength(10)]],
      nombre: ['', [Validators.pattern(/^-?([a-zA-ZñÑáéíóúÁÉÍÓÚ ]*)?$/), Validators.maxLength(30)]],
      genero: ['', Validators.required],
      tipo: ['', Validators.required],
    });
  }

  /**
   * Valida el estado del formulario.
   * @returns boolean
   */
  get validForm(): boolean {
    return (this.formCES.valid);
  }

  guardarPersona(): void {

    this.nuevaPersona = new Person();
    this.nuevaPersona.documento = this.formCES.get('documento').value;
    this.nuevaPersona.name = this.formCES.get('nombre').value;
    this.nuevaPersona.genero = this.formCES.get('genero').value;
    this.nuevaPersona.tipo = this.formCES.get('tipo').value;

    this.service.crearPersona(this.nuevaPersona).subscribe((response: Person) => {
      this.sweetMessage('success', '¡Usuario creado satisfactoriamente!');
      this.formCES.reset();
      this.existDocument = false;
    }, (error) => {
      this.existDocument = true;
      this.formCES.get('documento').setValue('');
      this.sweetMessage('warning', error.error);
    });
  }

  sweetMessage(type: any, message: any): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: type,
      title: message
    });
  }

}
