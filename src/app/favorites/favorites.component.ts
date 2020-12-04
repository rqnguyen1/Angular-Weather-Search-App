import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../favorites-service/favorites.service';
import { SearchService } from '../search-service/search.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy
{   
    fetchedFavorites = [ ];
    forecastJSON: any = null;

    private forecastSub: Subscription;
    private favoritesSub: Subscription;

    constructor(private searchService: SearchService, private favoritesService: FavoritesService) {};
    
    ngOnInit()
    {
        //subscribe to listen to any new favorites added
        this.favoritesSub = this.favoritesService.getFavoritesListener()
            .subscribe((fetchedFavorites) => {
                this.fetchedFavorites = fetchedFavorites;
        });

        this.retrieveFavorites();

        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON;
        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
        this.favoritesSub.unsubscribe();
    }

    //retrieve favorites from local storage upon app startup
    retrieveFavorites()
    {
        if (localStorage.getItem("favorites"))
        {      
            var favorites = JSON.parse(localStorage.getItem("favorites"))
            this.fetchedFavorites = favorites;
        }   
    }

    //deletes entry from favorites list and local storage upon clicking the trash icon
    deleteFavorite(entry)
    {
        this.favoritesService.deleteFavorite(entry);

        if (this.forecastJSON["forecast"]["city"] == entry.city && this.forecastJSON["forecast"]["state"] == entry.state)
        {
            this.favoritesService.uncheckFavorite();
        }
    }

    //performs a weather search on favorited entry that was clicked
    requestFavorite(latitude, longitude, State, City)
    {
        console.log(longitude, latitude);
        
        this.searchService.clearSearchResults();
        document.getElementById('prog-bar').hidden = false;
        this.searchService.fetchFavoritesWeather(latitude, longitude, State, City);
        document.getElementById('pills-results-tab').click();
        document.getElementById('currentlyTab').click();

    }

}