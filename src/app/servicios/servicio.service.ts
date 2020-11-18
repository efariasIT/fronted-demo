import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Person } from '../models/person.class';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  api = environment.api;

  protected generateBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'GET, POST',
    });
  }

  constructor(private http: HttpClient) { }

  public obtenerPersonas() {
    return this.http.get<any[]>(this.api + '/actions/getAllPersons', { headers: this.generateBasicHeaders() });
  }

  public crearPersona(persona: Person) {
    return this.http.post<any>(this.api + '/actions/savePerson', persona,
    { headers: this.generateBasicHeaders() });
  }
}
