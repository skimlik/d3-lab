import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LinechartComponent } from './linechart.component';
import { SimpleLineComponent } from './simple-line/simple-line.component';

export const Routes = [
    { path: 'charts/line-chart', component: LinechartComponent}
]

@NgModule({
    declarations: [
        LinechartComponent,
        SimpleLineComponent
    ],
    imports: [
        RouterModule.forChild(Routes)
    ]
})
export class LineChartModule {}

