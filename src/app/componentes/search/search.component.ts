import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Person } from '../../models/person.class';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ServicioService } from '../../servicios/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
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
export class SearchComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['documento', 'nombre', 'genero', 'tipo'];
  dataList: Person[] = [];
  dataSource = new MatTableDataSource<Person>();
  loading: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title,
    private service: ServicioService,
    public dialog: MatDialog) {

    this.loading = true;
  }

  /*
    Método del componente de su ciclo de vida, posterior a OnInit
  */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 1500);

  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts = () => {
    this.service.obtenerPersonas().subscribe((data: any) => {
      this.dataList = data;
      this.dataSource = new MatTableDataSource(this.dataList);
      this.dataSource.data = data as Person[];
      this.loading = false;
      this.sweetMessage('success', '¡Datos obtenidos correctamente!');
    }, (error) => {
      this.loading = false;
      this.sweetMessage('error', '¡Ha ocurrido un error, intentelo mas tarde.!');
    })
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

  /*
    Método de filtrado de la tabla por cualquier elemento (Columna)
  */
  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
