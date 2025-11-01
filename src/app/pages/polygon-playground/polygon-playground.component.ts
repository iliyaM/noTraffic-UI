import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CoreShapeComponent, NgKonvaEventObject, StageComponent} from 'ng2-konva';
import {IPolygon} from '../../core/interfaces/polygon.interface';
import {ContainerConfig} from 'konva/lib/Container';
import {PolygonService} from '../../core/services/polygon.service';
import {KonvaEventObject} from 'konva/lib/Node';
import {Stage} from 'konva/lib/Stage';
import {CustomIconsComponent} from '../../shared/components/custsom-icons/custom-icons.component';
import {GenericModalService} from '../../core/services/generic-modal.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-polygon-playground',
  imports: [
    CoreShapeComponent,
    StageComponent,
    CustomIconsComponent,
  ],
  templateUrl: './polygon-playground.component.html',
  styleUrl: './polygon-playground.component.scss',
})

export class PolygonPlaygroundComponent implements OnInit {
  @ViewChild('renderStage', {static: true}) renderStage!: ElementRef;
  configStage!: ContainerConfig;
  polygons: IPolygon[] = [];

  drawingPoints: number[][] = [];
  highlightedId: number | null = null;
  workingPolygonId: number | null = null;

  bgImageConfig: any = {
    x: 0,
    y: 0,
  };
  imageObj: HTMLImageElement = new window.Image();

  constructor(private polygonService: PolygonService, private genericModalService: GenericModalService) {
  }

  ngOnInit() {
    // Set initial Configurations to render area.
    this.setConfigurationToRenderingStage();

    // Load all polygons
    this.loadPolygons();
  }

  setConfigurationToRenderingStage() {
    this.configStage = {
      width: this.renderStage.nativeElement.offsetWidth,
      height: this.renderStage.nativeElement.offsetHeight || window.innerHeight
    };
    this.imageObj.src = 'https://picsum.photos/1920/1080';
    this.imageObj.onload = () => {
      this.bgImageConfig = {
        ...this.bgImageConfig,
        image: this.imageObj,
        width: this.configStage.width,
        height: this.configStage.height
      };
    };
  }

  onStageClick(event: NgKonvaEventObject<MouseEvent>) {
    if (!event || !event.event || !event.event.target) return;

    const konvaEvent: KonvaEventObject<MouseEvent> = event.event;
    const stage: Stage | null = konvaEvent.target.getStage();
    const pointer = stage?.getPointerPosition();

    if (!pointer) return;
    this.drawingPoints = [...this.drawingPoints, [pointer.x, pointer.y]];
  }

  finishPolygonDrawing() {
    if (this.drawingPoints.length < 3) return;

    if (this.workingPolygonId) {
      this.updatePolygon(this.workingPolygonId);
      this.workingPolygonId = null;
    } else {
      this.addNewPolygon();
    }
  }

  loadPolygons() {
    this.genericModalService.open('LOADING', '5 seconds loading please wait...');
    this.polygonService.getAllPolygons().subscribe({
      next: (data: IPolygon[]) => {
        this.genericModalService.close();
        this.polygons = [...data];
      },
      error: (err: HttpErrorResponse) => {
        this.genericModalService.close();
        this.genericModalService.open('ERROR', 'Error loading Polygons try again');
        console.error(err.error.message);
      }
    });
  }

  addNewPolygon() {
    const newPolygon: IPolygon = {
      id: null,
      name: this.polygonService.createPolygonName(this.polygons),
      points: [...this.drawingPoints]
    }
    this.drawingPoints = [];

    this.genericModalService.open('LOADING', '5 seconds loading please wait...');

    this.polygonService.createPolygon(newPolygon).subscribe({
      next: (savedPolygon: IPolygon) => {
        this.genericModalService.close();
        this.polygons.push(savedPolygon)
      }, error: (err: HttpErrorResponse) => {
        this.genericModalService.close();
        this.genericModalService.open('ERROR', 'Error saving new polygon try again');
        console.error(err.error.message);
      }
    });
  }


  updatePolygon(polygonId: number) {
    this.genericModalService.open('LOADING', '5 seconds loading please wait...');

    // find locally the polygon to update.
    const polygonIndex: number = this.polygons.findIndex((polygon: IPolygon) => polygon.id === polygonId);
    if (polygonIndex === -1) return;

    // set the new points to the polygon to update
    const updatedPolygon: IPolygon = {
      ...this.polygons[polygonIndex],
      points: [...this.drawingPoints]
    }

    this.polygonService.patchPolygon(updatedPolygon).subscribe({
      next: (updatedPolygon: IPolygon) => {
        this.genericModalService.close();

        // update the local polygon with the new points
        this.polygons[polygonIndex].points = [...updatedPolygon.points];
      }, error: (err: HttpErrorResponse) => {
        this.genericModalService.close();
        this.genericModalService.open('ERROR', `Error updating polygon try again`);
        console.error(err.error.message);
      }
    })
    this.drawingPoints = [];
  }

  deletePolygon(polygon: IPolygon) {
    this.genericModalService.open('LOADING', '5 seconds loading please wait...');

    this.polygonService.deletePolygon(polygon.id).subscribe({
      next: () => {
        const foundIndex: number = this.polygons.findIndex((p: IPolygon) => p.id === polygon.id);
        if (foundIndex !== -1) {
          this.polygons.splice(foundIndex, 1);
        }
        this.genericModalService.close();
      }, error: (err: HttpErrorResponse) => {
        this.genericModalService.close();
        this.genericModalService.open('ERROR', 'Error deleting polygon try again');
        console.error(err.error.message);
      }
    });
  }

  onHoverPolygon(id: number | null) {
    if (!id)
      return;

    this.highlightedId = id;
  }

  onLeavePolygon() {
    this.highlightedId = null;
  }

  setPolygonActive(polygon: IPolygon) {
    this.workingPolygonId = polygon.id ? polygon.id : null;
    this.drawingPoints = [...polygon.points]
  }
}
