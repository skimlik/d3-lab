import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

export interface ICoordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-svg-tooltip',
  templateUrl: './svg-tooltip.component.html',
  styleUrls: ['./svg-tooltip.component.scss']
})
export class SvgTooltipComponent implements OnInit {
  private text: string = '';
  private host: any;

  @Input() public set innerText(value: string) {
    this.text = value;
  }

  @Input() public stroke: string = 'steelblue';

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    this.host = this.element.nativeElement.querySelector('.svg-tooltip');
    d3.select(this.host).style('border-color', this.stroke);
  }

  @Input() public set move(value: ICoordinates) {
    let host = d3.select(this.host);
    if (value.x + value.y === 0) {
      host.style('opacity', 0);
      return;
    }
    host.transition().duration(50)
      .style('left', `${value.x}px`)
      .style('top', `${value.y}px`)
      .style('opacity', 0.9);
  }
}
