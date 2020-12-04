import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchService 
{
    ipApiJSON: any = null;
    forecastJSON: any = null;
    lat = 0;
    lng = 0;
    street = "";
    city = "";
    state = "";
    showProgressBar = false;
    clearResults = false;

    private updatedForecastJSON = new Subject<any>();
    private updatedClearResults = new Subject<any>();

    constructor(private http: HttpClient ) {}

    //makes HTTP request to fetch weather forecast JSON data
    fetchWeather(street, city, state, currLocation)
    {
        //current location
        if (currLocation)
        {
            this.http.get('http://ip-api.com/json')
                .subscribe((jsonData) => 
                {
                    this.ipApiJSON = jsonData;
                    this.city = this.ipApiJSON.city;
                    this.state = this.ipApiJSON.region;
                    var params = {params: {lat: this.ipApiJSON.lat, lng: this.ipApiJSON.lon, state: this.ipApiJSON.region}};
                    this.lat = this.ipApiJSON.latitude;
                    this.lng = this.ipApiJSON.longitude;
                    console.log(jsonData);
                    this.http.get('http://www.ngweatherappnodejs-env-1.eba-ti3uemnm.us-east-2.elasticbeanstalk.com/weather', params)
                        .subscribe((jsonData) => 
                        {
                            this.forecastJSON = jsonData;
                            this.forecastJSON["forecast"]["city"] = this.city;
                            this.forecastJSON["forecast"]["street"] = this.street;
                            this.forecastJSON["forecast"]["state"] = this.state;
                            this.updatedForecastJSON.next(this.forecastJSON);
                        });

                });
        }

        //user inputted street, city, and state
        else
        {
            this.street = street;
            this.city = city;
            this.state = state;
            var params = {params: {street: this.street, city: this.city, state: this.state} }
            this.http.get('http://www.ngweatherappnodejs-env-1.eba-ti3uemnm.us-east-2.elasticbeanstalk.com/weather', params)
                .subscribe((jsonData) => 
                {
                    if (jsonData != "error")
                    {
                        console.log(jsonData);
                        this.forecastJSON = jsonData;
                        this.forecastJSON["forecast"]["city"] = this.city;
                        this.forecastJSON["forecast"]["street"] = this.street;
                        this.forecastJSON["forecast"]["state"] = this.state;
                        this.updatedForecastJSON.next(this.forecastJSON);
                        
                    }
                    else if (jsonData == "error")
                    {
                        document.getElementById("invalidAddress").hidden = false;
                        document.getElementById("prog-bar").hidden = true;
                        console.log("Invalid address");
                    }
                });
        }
    }

    //makes HTTP request to fetch weather forecast JSON data for the favorited entry clicked
    fetchFavoritesWeather(latitude, longitude, State, City)
    {
        var params = {params: {lat: latitude, lng: longitude, state: State}};

        this.http.get('http://www.ngweatherappnodejs-env-1.eba-ti3uemnm.us-east-2.elasticbeanstalk.com/weather', params)
            .subscribe((jsonData) => 
            {
                this.forecastJSON = jsonData;
                this.forecastJSON["forecast"]["city"] = City
                this.forecastJSON["forecast"]["street"] = "";
                this.forecastJSON["forecast"]["state"] = State;
                this.updatedForecastJSON.next(this.forecastJSON);
            });
    }

    //returns observable for forecastJSON
    getForecastUpdateListener()
    {
        return this.updatedForecastJSON.asObservable();
    }

    //refresh forecastJSON to trigger subscriptions
    refreshForecastJSON()
    {
        this.updatedForecastJSON.next(this.forecastJSON);
    }

    //updates the clearResults flag to be true
    clearSearchResults()
    {
        this.clearResults = true;
        return this.updatedClearResults.next(this.clearResults);
    }

    //returns observable for clearResults flag
    getClearResultsListener()
    {
        return this.updatedClearResults.asObservable();
    }

}