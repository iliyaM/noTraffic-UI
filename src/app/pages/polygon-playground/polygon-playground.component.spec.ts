import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PolygonPlaygroundComponent } from './polygon-playground.component';
import { PolygonService } from '../../core/services/polygon.service';
import { GenericModalService } from '../../core/services/generic-modal.service';
import { of, throwError } from 'rxjs';
import { IPolygon } from '../../core/interfaces/polygon.interface';

describe('PolygonPlaygroundComponent', () => {
  let component: PolygonPlaygroundComponent;
  let fixture: ComponentFixture<PolygonPlaygroundComponent>;
  let polygonServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    polygonServiceMock = {
      getAllPolygons: jasmine.createSpy('getAllPolygons').and.returnValue(of([])),
      createPolygon: jasmine.createSpy('createPolygon'),
      patchPolygon: jasmine.createSpy('patchPolygon'),
      deletePolygon: jasmine.createSpy('deletePolygon'),
      createPolygonName: jasmine.createSpy('createPolygonName').and.returnValue('Polygon # 1')
    };

    modalServiceMock = {
      open: jasmine.createSpy('open'),
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [PolygonPlaygroundComponent],
      providers: [
        { provide: PolygonService, useValue: polygonServiceMock },
        { provide: GenericModalService, useValue: modalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolygonPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load polygons and call modal service', fakeAsync(() => {
    const polygons: IPolygon[] = [
      { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] }
    ];
    polygonServiceMock.getAllPolygons.and.returnValue(of(polygons));

    component.loadPolygons();
    tick();

    expect(modalServiceMock.open).toHaveBeenCalledWith('LOADING', '5 seconds loading please wait...');
    expect(modalServiceMock.close).toHaveBeenCalled();
    expect(component.polygons.length).toBe(1);
  }));

  it('should add a new polygon', fakeAsync(() => {
    const newPolygon: IPolygon = { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] };
    polygonServiceMock.createPolygon.and.returnValue(of(newPolygon));

    component.drawingPoints = [[0,0],[1,0],[1,1]];
    component.polygons = [];
    component.addNewPolygon();
    tick();

    expect(modalServiceMock.open).toHaveBeenCalled();
    expect(modalServiceMock.close).toHaveBeenCalled();
    expect(component.polygons.length).toBe(1);
    expect(component.polygons[0].name).toBe('Polygon # 1');
    expect(component.drawingPoints.length).toBe(0);
  }));

  it('should update existing polygon', fakeAsync(() => {
    const polygon: IPolygon = { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] };
    component.polygons = [polygon];
    component.drawingPoints = [[0,0],[2,0],[2,2]];

    polygonServiceMock.patchPolygon.and.returnValue(of({ ...polygon, points: component.drawingPoints }));

    component.updatePolygon(1);
    tick();

    expect(component.polygons[0].points).toEqual([[0,0],[2,0],[2,2]]);
    expect(modalServiceMock.close).toHaveBeenCalled();
    expect(component.drawingPoints.length).toBe(0);
  }));

  it('should delete polygon', fakeAsync(() => {
    const polygon: IPolygon = { id: 1, name: 'Polygon # 1', points: [[0,0],[1,0],[1,1]] };
    component.polygons = [polygon];

    polygonServiceMock.deletePolygon.and.returnValue(of(null));

    component.deletePolygon(polygon);
    tick();

    expect(component.polygons.length).toBe(0);
    expect(modalServiceMock.close).toHaveBeenCalled();
  }));

  it('should set highlightedId on hover and clear on leave', () => {
    component.onHoverPolygon(1);
    expect(component.highlightedId).toBe(1);

    component.onLeavePolygon();
    expect(component.highlightedId).toBeNull();
  });


});
