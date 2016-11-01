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
    selector: 'app-lines-chart',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit {
    private nativeElement: any;
    private svg: any;

    constructor(element: ElementRef) {
        this.nativeElement = element.nativeElement;
    }

    public ngOnInit() {
        let ds1: IDataObject[] = [
            { revenue: 30, price: 1 },
            { revenue: 35, price: 2 },
            { revenue: 40, price: 3 },
            { revenue: 32, price: 4 },
            { revenue: 30, price: 5 },
            { revenue: 28, price: 6 },
            { revenue: 31, price: 7 },
            { revenue: 30, price: 8 },
            { revenue: 32, price: 9 },
            { revenue: 44, price: 10 },
            { revenue: 28, price: 11 },
            { revenue: 34, price: 12 },
            { revenue: 28, price: 13 },
            { revenue: 31, price: 14 },
            { revenue: 30, price: 15 },
            { revenue: 32, price: 16 },
            { revenue: 34, price: 17 },
            { revenue: 28, price: 18 }
        ];

        let ds2: IDataObject[] = [
            { revenue: 23, price: 1 },
            { revenue: 32, price: 2 },
            { revenue: 24, price: 3 },
            { revenue: 28, price: 4 },
            { revenue: 35, price: 5 },
            { revenue: 21, price: 6 },
            { revenue: 33, price: 7 },
            { revenue: 20, price: 8 },
            { revenue: 22, price: 9 },
            { revenue: 24, price: 10 },
            { revenue: 38, price: 11 },
            { revenue: 24, price: 12 },
            { revenue: 24, price: 13 },
            { revenue: 21, price: 14 },
            { revenue: 20, price: 15 },
            { revenue: 22, price: 16 },
            { revenue: 24, price: 17 },
            { revenue: 38, price: 18 }
        ];

        let container = this.nativeElement.querySelector('.line-component');

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', container.clientWidth)
            .attr('height', 360);

        let zone = this.svg.append('g')
            .attr('transform', `translate(20, 40)`)
            .attr('width', container.clientWidth - 40)
            .attr('height', 300);

        let x = d3.scaleLinear().range([0, container.clientWidth - 80]).domain(d3.extent(ds1, d => d.price));
        let y = d3.scaleLinear().range([0, 300]).domain([d3.max(ds1, d => d.revenue), 0]);

        let line1 = d3.line<IDataObject>().x(d => x(d.price)).y(d => y(d.revenue));
        let line2 = d3.line<IDataObject>().x(d => x(d.price)).y(d => y(d.revenue));

        let xAxis = d3.axisBottom(x);
        let yAxys = d3.axisLeft(y);

        this.svg.append('g')
            .attr('transform', `translate(20, ${340})`)
            .attr('class', 'axis axis--x')
            .call(xAxis);

        this.svg.append('g')
            .attr('transform', `translate(20, 40)`)
            .attr('class', 'axis axis--y')
            .call(yAxys);

        zone.append('path').datum(ds1).attr('class', 'line1').attr('d', line1);
        zone.append('path').datum(ds2).attr('class', 'line2').attr('d', line2);
    }
}