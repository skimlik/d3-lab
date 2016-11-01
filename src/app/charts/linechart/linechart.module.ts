import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LinechartComponent } from './linechart.component';

export const Routes = [
    { path: 'charts/line-chart', component: LinechartComponent}
]

@NgModule({
    declarations: [
        LinechartComponent
    ],
    imports: [
        RouterModule.forChild(Routes)
    ]
})
export class LineChartModule {}

