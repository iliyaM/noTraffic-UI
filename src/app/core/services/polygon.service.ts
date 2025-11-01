import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IPolygon} from '../interfaces/polygon.interface';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root',
})
export class PolygonService {

  constructor(private httpService: HttpService) {
  }

  getAllPolygons(): Observable<IPolygon[]> {
    return this.httpService.get('polygons');
  }

  createPolygon(newPolygon: IPolygon): Observable<IPolygon> {
    return this.httpService.post('polygons', newPolygon);
  }

  deletePolygon(id: number | null): Observable<IPolygon> {
    return this.httpService.delete(`polygons/${id}`);
  }

  patchPolygon(body: IPolygon): Observable<IPolygon> {
    return this.httpService.patch(`polygons`, body);
  }

  createPolygonName(polygons: IPolygon[]): string {
    let i: number = 1;
    const existingNumbers: string[] = polygons.map(p => p.name);

    while (existingNumbers.includes(`Polygon # ${i}`)) {
      i++;
    }
    return `Polygon # ${i}`;
  }
}
