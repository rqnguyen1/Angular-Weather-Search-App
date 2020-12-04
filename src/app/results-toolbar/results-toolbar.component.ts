import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../favorites-service/favorites.service';
import { SearchService } from '../search-service/search.service';

@Component({
    selector: 'app-results-toolbar',
    templateUrl: './results-toolbar.component.html',
    styleUrls: ['./results-toolbar.component.css']
})
export class ResultsToolbarComponent implements OnInit, OnDestroy
{   
    forecastJSON: any = null;
    star = "star";
    star_border = "star_border";
    starStyle = "uncheckedFavorite";
    currIcon = "star_border";

    private forecastSub: Subscription;
    private uncheckFavoriteSub: Subscription;

    constructor(private searchService: SearchService, private favoritesService: FavoritesService) {};

    ngOnInit()
    {
        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON
                this.checkFavorited();
        });

        //subscribe to listen to if current search result's address was deleted from favorites list using the trash icon
        this.uncheckFavoriteSub = this.favoritesService.getUncheckFavoriteListener()
            .subscribe((uncheckStar) => {
                this.currIcon = this.star_border;
                this.starStyle = 'uncheckedFavorite';
    });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
        this.uncheckFavoriteSub.unsubscribe();
    }

    //refreshes the forecast JSON on click of the weekly tab to get fresh data
    refreshForecastJSON()
    {
        this.searchService.refreshForecastJSON();
    }

    //on click of the favorite icon
    clickFavorite()
    {
        if ((this.currIcon) == "star_border")
        {  
            this.favoritesService.clickFavorite(this.currIcon, this.forecastJSON);
            this.currIcon = this.star;
            this.starStyle = 'checkedFavorite';
        }
        else
        {
            this.favoritesService.clickFavorite(this.currIcon, this.forecastJSON);
            this.currIcon = this.star_border;
            this.starStyle = 'uncheckedFavorite'
        }

    }

    //checks to see if current search is in favorites and marks the star icon if it is
    checkFavorited()
    {
        if (localStorage.getItem("favorites"))
        {
            var favorites = JSON.parse(localStorage.getItem("favorites"));
            for (var i =0; i < favorites.length; ++i)
            {
                if (favorites[i].city == this.forecastJSON["forecast"]["city"] && favorites[i].state == this.forecastJSON["forecast"]["state"])
                {
                    this.currIcon = this.star;
                    this.starStyle = 'checkedFavorite';
                    return;
                }
            }
        }
        this.currIcon = this.star_border;
        this.starStyle = 'uncheckedFavorite'
    }
    
    //tweets the current weather on click of the twitter icon
    tweetWeather()
    {
        var url = "https://twitter.com/intent/tweet";
        url += "?text=The%20current%20temperature%20at%20" + this.forecastJSON["forecast"]["city"] + "%20is%20" + this.forecastJSON.forecast.currently.temperature;
        url += "°F.%20The%20weather%20conditions%20are%20" + this.forecastJSON.forecast.currently.summary + ".";
        url += "%20&hashtags=CSCI571WeatherSearch";
        window.open(url);
    }

}