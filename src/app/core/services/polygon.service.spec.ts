import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';
import {HttpService} from './http.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {IPolygon} from '../interfaces/polygon.interface';
import {of} from 'rxjs';

describe('PolygonService', () => {
  let service: PolygonService;
  let httpServiceMock: any;

  beforeEach(() => {
    httpServiceMock = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      delete: jasmine.createSpy('delete'),
      patch: jasmine.createSpy('patch')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PolygonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllPolygons should call httpService.get', () => {
    const polygons: IPolygon[] = [{ id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] }];
    httpServiceMock.get.and.returnValue(of(polygons));

    service.getAllPolygons().subscribe(result => {
      expect(result).toEqual(polygons);
    });

    expect(httpServiceMock.get).toHaveBeenCalledWith('polygons');
  });

  it('createPolygon should call httpService.post', () => {
    const newPolygon: IPolygon = { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] };
    httpServiceMock.post.and.returnValue(of(newPolygon));

    service.createPolygon(newPolygon).subscribe(result => {
      expect(result).toEqual(newPolygon);
    });

    expect(httpServiceMock.post).toHaveBeenCalledWith('polygons', newPolygon);
  });

  it('deletePolygon should call httpService.delete with id', () => {
    const polygonId = 42;
    const deletedPolygon: IPolygon = { id: polygonId, name: 'Polygon # 42', points: [[0,0],[1,0],[1,1]] };
    httpServiceMock.delete.and.returnValue(of(deletedPolygon));

    service.deletePolygon(polygonId).subscribe(result => {
      expect(result).toEqual(deletedPolygon);
    });

    expect(httpServiceMock.delete).toHaveBeenCalledWith(`polygons/${polygonId}`);
  });

  it('patchPolygon should call httpService.patch', () => {
    const polygon: IPolygon = { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] };
    httpServiceMock.patch.and.returnValue(of(polygon));

    service.patchPolygon(polygon).subscribe(result => {
      expect(result).toEqual(polygon);
    });

    expect(httpServiceMock.patch).toHaveBeenCalledWith('polygons', polygon);
  });

  it('createPolygonName should generate unique name', () => {
    const polygons: IPolygon[] = [
      { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] },
      { id: 2, name: 'Polygon # 2', points: [[0,0],[1,0],[1,1]] }
    ];

    const name = service.createPolygonName(polygons);
    expect(name).toBe('Polygon # 3');
  });

  it('createPolygonName should return Polygon # 1 if empty list', () => {
    const name = service.createPolygonName([]);
    expect(name).toBe('Polygon # 1');
  });

});
