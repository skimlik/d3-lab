import { ModuleWithProviders } from '@angular/core';
import { RouterModule , Routes} from '@angular/router';
import { LinechartComponent } from './linechart/linechart.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
            { path: 'line', component: LinechartComponent },
            { path: '', component: HomeComponent },
            { path: '**', component: HomeComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
