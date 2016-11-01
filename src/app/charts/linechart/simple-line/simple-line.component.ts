import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { Selection, ScaleLinear, Axis } from 'd3';

interface IDimensions {
  portW: number;
  portH: number;
  width: number;
  height: number;
  margin: { left: number, top: number, right: number, bottom: number };
}

interface IDataObject {
  revenue: number;
  price: number;
}

@Component({
  selector: 'app-simple-line-chart',
  templateUrl: './simple-line.component.html',
  styleUrls: ['./simple-line.component.scss']
})
export class SimpleLineComponent implements OnInit {

  private nativeElement: any;
  private svg: any;
  private dimensions: IDimensions;
  private focus: any;
  private chartLine: any;

  private x: ScaleLinear<number, number>;
  private y: ScaleLinear<number, number>;

  private xAxis: Axis<Number>;
  private yAxis: Axis<Number>;

  constructor(elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }

  private getDimensions(container?: any): IDimensions {
    if (!(container)) {
        container = this.nativeElement.querySelectorAll('.simple-line-component')[0];
    }

    let w = container.clientWidth;
    let h = 560;
    let margin = { left: 40, top: 40, right: 40, bottom: 30 };

    let dimensions: IDimensions = {
      portW: w,
      portH: h,
      margin: margin,
      width: w - margin.left - margin.right,
      height: h - margin.top - margin.bottom
    };
    return dimensions;
  }

  private updateChart(): void {
    let dim = this.dimensions = this.getDimensions();

    d3.select('.zoom')
      .attr('width', `${dim.width}px`)
      .attr('height', `${dim.height}px`);

    this.yAxis.tickSizeInner(-dim.width);
    this.xAxis.tickSizeInner(-dim.height);

    this.x.range([0, dim.width]).nice();
    this.y.range([dim.height, 0]).nice();

    d3.select('.axis--x').call(this.xAxis);
    d3.select('.axis--y').call(this.yAxis);

    this.focus.select('path').attr('d', this.chartLine);
  }

  public ngOnInit() {
    let container = this.nativeElement.querySelectorAll('.simple-line-component')[0];
    let dim = this.getDimensions(container);
    this.dimensions = dim;
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', dim.portW).attr('height', dim.portH);

    d3.json('data/test.json', (error, json: IDataObject[]) => {
      if (error) {
        throw error;
      }

      let data: IDataObject[] = json;
      this.createChart(data);
      this.updateChart();
    });
  }

  private createChart(data: IDataObject[]): void {
    let dim = this.dimensions;
    this.x = d3.scaleLinear().domain(d3.extent(data, (d: IDataObject) => d.price));
    this.y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.revenue)]);

    this.xAxis = d3.axisBottom<Number>(this.x).tickPadding(10);
    this.yAxis = d3.axisLeft<Number>(this.y).tickPadding(10);

    this.chartLine = d3.line<IDataObject>()
      .x((d) => this.x(d.price))
      .y((d) => this.y(d.revenue));

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${dim.margin.left}, ${dim.margin.top})`)
      .attr('width', dim.width)
      .attr('height', dim.height);

    this.focus.append('path')
      .datum(data)
      .attr('class', 'chartArea');

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(${dim.margin.left}, ${dim.height + dim.margin.top})`)
      .call(this.xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${dim.margin.left}, ${dim.margin.top})`)
      .call(this.yAxis);

    this.svg.append('rect')
      .attr('transform', `translate(${dim.margin.left}, ${dim.margin.top})`)
      .attr('class', 'zoom')
      .on('mouseover', () => this.setMarkerOpacity(20))
      .on('mouseout', () => this.setMarkerOpacity(0))
      .on('mousemove', mousemoved);

    this.createMarker();
    let self = this;
    let bisect = d3.bisector((d: IDataObject) => d.price).left;

    function mousemoved() {
      let dimensions = self.dimensions;
      let xPos = d3.mouse(this)[0];

      let x0 = self.x.invert(xPos);
      let i = bisect(data, x0);

      let d1 = data[i];
      let d0 = i > 0 ? data[i - 1] : d1;
      let d = x0 - d0.price > d1.price - x0 ? d1 : d0;

      let lineMarker = self.svg.select('.marker-line');
      let marker = self.svg.select('.marker');

      let xp = self.x(d.price) + dimensions.margin.left;
      let yp = self.y(d.revenue) + dimensions.margin.top;

      marker.attr('transform', `translate(${xp}, ${yp})`);
      lineMarker.attr('y1', yp).attr('x1', xp).attr('x2', xp);
    }
  }

  private createMarker() {
    let dim = this.dimensions;
    this.svg.append('line')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', dim.margin.top).attr('y2', dim.height + dim.margin.top)
      .style('opacity', 0)
      .classed('marker-line', true);

    this.svg.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5)
      .style('opacity', 0)
      .classed('marker', true);
  }

  private setMarkerOpacity(opacity: number): void {
    this.svg.select('.marker-line').transition().duration(500).style('opacity', opacity);
    this.svg.select('.marker').transition().duration(500).style('opacity', opacity);
  }
}
