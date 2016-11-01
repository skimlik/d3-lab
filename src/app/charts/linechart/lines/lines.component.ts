import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { Selection, ScaleLinear, Axis, Bisector } from 'd3';

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
    private x: ScaleLinear<number, number>;
    private y: ScaleLinear<number, number>;

    @Input()
    public revenue1: number;

    @Input()
    public revenue2: number;

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

        let x = this.x = d3.scaleLinear().range([0, container.clientWidth - 80]).domain(d3.extent(ds1, d => d.price));
        let y = this.y = d3.scaleLinear().range([0, 300]).domain([d3.max(ds1, d => d.revenue), 0]);

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

        let plot = this.svg.append('g')
            .append('rect')
            .classed('plot', true)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .attr('x', 20)
            .attr('y', 40)
            .attr('width', container.clientWidth - 40)
            .attr('height', 300);

        plot.on('mouseover', () => {
            d3.selectAll('.svg-tooltip').transition().duration(500).style('opacity', 0.8);
            d3.select('.marker-line').transition().duration(500).style('opacity', 1);
        });
        plot.on('mouseout', () => {
            d3.selectAll('.svg-tooltip').transition().duration(500).style('opacity', 0);
            d3.select('.marker-line').transition().duration(500).style('opacity', 0);
        });
        plot.on('mousemove', mousemoved);

        let bisect = d3.bisector((d: IDataObject) => d.price).left;
        let self = this;

        function mousemoved() {
            let xPos = d3.mouse(this)[0];
            let cords1 = self.getCords(ds1, xPos, bisect);
            let cords2 = self.getCords(ds2, xPos, bisect);

            self.revenue1 = cords1.r;
            self.revenue2 = cords2.r;

            if (cords2.yp > cords1.yp && cords2.yp <= cords1.yp + 35) {
                cords2.yp += 35;
            }

            if (cords1.yp > cords2.yp && cords1.yp <= cords2.yp + 35) {
                cords1.yp += 35;
            }

            let tooltip1 = d3.select('#tooltip1');
            let tooltip2 = d3.select('#tooltip2');

            self.showTooltip(tooltip1, cords1);
            self.showTooltip(tooltip2, cords2);
        }
    }

    private showTooltip(el: any, cords: any) {
        el.transition().duration(50)
        .style('left', `${cords.xp}px`)
        .style('top', `${cords.yp}px`)
        .style('opacity', 0.9);
    }

    private getCords(data: IDataObject[], xpos: number, bisect: any): { xp: number, yp: number, r: number } {
        let x0 = this.x.invert(xpos);

        let i1 = bisect(data, x0)

        let d1 = data[i1];
        let d0 = i1 > 0 ? data[i1 - 1] : d1;
        let def = x0 - d0.price > d1.price - x0 ? d1 : d0;
        let xp1 = this.x(def.price) + 20;
        let yp1 = this.y(def.revenue) + 20;
        return {
            'r': def.revenue,
            'xp': xp1,
            'yp': yp1
        };
    }
}
