import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from 'ng2-charts';
import { ThemeService } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ResultsFavoritesTabComponent } from './results-favorites-tab/results-favorites-tab.component';
import { WeatherCardComponent } from './weather-card/weather-card.component'
import { ResultsToolbarComponent } from './results-toolbar/results-toolbar.component';
import { HourlyChartsComponent } from './hourly-charts/hourly-charts.component';
import { WeeklyChartComponent } from './weekly-chart/weekly-chart.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultsFavoritesTabComponent,
    WeatherCardComponent,
    ResultsToolbarComponent,
    HourlyChartsComponent,
    WeeklyChartComponent,
    ProgressBarComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MatCardModule,
    HttpClientModule,
    ChartsModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
