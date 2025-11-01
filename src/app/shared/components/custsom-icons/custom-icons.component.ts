import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-icons',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" class="icon">
      <use [attr.href]="'svg-sprite.svg#' + name"></use>
    </svg>
  `,
  styles:`

    svg {
      transition: all 0.3s;
    }
    svg:hover {
      cursor: pointer;
      transform: scale(1.1);
    }`
})
export class CustomIconsComponent {
  @Input() name!: string;
  @Input() size: number = 24;
}
