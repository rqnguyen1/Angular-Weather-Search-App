import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search-service/search.service';

@Component({
    selector: 'app-results-favorites-tab',
    templateUrl: './results-favorites-tab.component.html',
    styleUrls: ['./results-favorites-tab.component.css']
})
export class ResultsFavoritesTabComponent implements OnInit, OnDestroy
{
    forecastJSON: any = null;
    showResults = false;

    private forecastSub: Subscription;
    private clearResultsSub: Subscription;

    constructor(private searchService: SearchService) {};
    
    ngOnInit()
    {
        document.getElementById('prog-bar').hidden = true;
        
        //subscribe to listen if the user presses clear on the form
        this.clearResultsSub = this.searchService.getClearResultsListener()
        .subscribe((clearResults) => {
            this.showResults = !clearResults;
        });

        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON
                console.log(this.forecastJSON);
                this.showResults = true;
        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
        this.clearResultsSub.unsubscribe();
    }

}