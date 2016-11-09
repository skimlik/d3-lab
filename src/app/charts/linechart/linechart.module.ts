import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LinechartComponent } from './linechart.component';
import { SimpleLineComponent } from './simple-line/simple-line.component';
import { LinesComponent } from './lines/lines.component';
import { SvgTooltipComponent } from '../../charts/shared';

export const Routes = [
    { path: 'charts/line-chart', component: LinechartComponent}
]

@NgModule({
    declarations: [
        LinechartComponent,
        SimpleLineComponent,
        SvgTooltipComponent,
        LinesComponent
    ],
    imports: [
        RouterModule.forChild(Routes)
    ]
})
export class LineChartModule {}

