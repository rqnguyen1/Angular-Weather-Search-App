import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search-service/search.service';

@Component({
    selector: 'app-weather-card',
    templateUrl: './weather-card.component.html',
    styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent implements OnInit, OnDestroy
{   
    forecastJSON: any = null;
    city = "";
    showResults = false;

    private forecastSub: Subscription;

    constructor(private searchService: SearchService) {};

    ngOnInit()
    {
        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON
                console.log(this.forecastJSON);
                this.city = forecastJSON["forecast"]["city"];
                this.showResults = true;
        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
    }
}
