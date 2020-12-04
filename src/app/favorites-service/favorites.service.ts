import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FavoritesService 
{
    fetchedFavorites = [ ];
    uncheckStar = false;

    private updatedFavorites= new Subject<any>();
    private updatedUncheckStar = new Subject<any>();

    //returns listener for updatedFavorites
    getFavoritesListener()
    {
        return this.updatedFavorites.asObservable();
    }

    //service for on click of the favorite icon
    clickFavorite(currIcon, forecastJSON)
    {
        var city = forecastJSON["forecast"]["city"];
        var street = forecastJSON["forecast"]["street"];
        var state = forecastJSON["forecast"]["state"];
        var currLat = forecastJSON["forecast"]["latitude"];
        var currLon = forecastJSON["forecast"]["longitude"];

        //add to favorites
        if ((currIcon) == "star_border")
        {  
            if (localStorage.getItem("favorites"))
            { 
                
                var entry;
                entry = {"lat": currLat, "lng": currLon, "street": street, "city": city, "state": state, "seal": forecastJSON.customSearch.items[0].link};
                var favorites = JSON.parse(localStorage.getItem("favorites"))
                favorites.push(entry);
                localStorage.setItem('favorites', JSON.stringify(favorites));          
                console.log(favorites);
                this.updatedFavorites.next(favorites);
            }

            else
            {
                var emptyFavorites = [ ];
                entry = {"lat": currLat, "lng": currLon, "street": street, "city": city, "state": state, "seal": forecastJSON.customSearch.items[0].link};
                emptyFavorites.push(entry);
                localStorage.setItem('favorites', JSON.stringify(emptyFavorites));
                this.updatedFavorites.next(emptyFavorites);
            }
        }
        
        //remove from favorites
        else
        {
            var favorites = JSON.parse(localStorage.getItem("favorites"))
            for (var i = 0; i < favorites.length; ++i)
            {
                if (favorites[i].city == city && favorites[i].state == state)
                    favorites.splice(i, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.updatedFavorites.next(favorites);
        }

    }
    
    //deletes entry from favorites list and local storage upon clicking the trash icon
    deleteFavorite(entry)
    {

        var favorites = JSON.parse(localStorage.getItem("favorites"))
        for (var i = 0; i < favorites.length; ++i)
        {
            if (favorites[i].lat == entry.lat && favorites[i].lng == entry.lng)
                favorites.splice(i, 1);
        }

        this.fetchedFavorites = favorites;
        localStorage.setItem("favorites",JSON.stringify(favorites));
        this.updatedFavorites.next(favorites);

    }

    //returns an observable for updatedUncheckFavorites
    getUncheckFavoriteListener()
    {
        return this.updatedUncheckStar.asObservable();
    }

    //if current search result is the same as favorite entry deleted, uncheck the star icon
    uncheckFavorite()
    {
        this.uncheckStar = true;
        this.updatedUncheckStar.next(this.uncheckStar);
    }


    



}