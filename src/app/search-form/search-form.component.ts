import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchService } from "../search-service/search.service";
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit, OnDestroy
{
    street = "";
    city = "";
    state = "";
    selectedState = null;
    currLocation = false;
    disableStreet = false;
    disableCity = false;
    disableState = false;
    autoCompleteJson: any = null;
    autoCompleteList = [];
    cityText = "";

    private forecastSub: Subscription;

    constructor(private searchService: SearchService, private http: HttpClient) {}

    ngOnInit()
    {
        this.forecastSub = this.searchService.getForecastUpdateListener()
        .subscribe((forecastJSON) => {
            document.getElementById('prog-bar').hidden = true;
        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
    }
    
    //on form submit
    onSubmit(form: NgForm)
    {
        this.street = form.value.street;
        this.city = form.value.city;
        this.state = form.value.state;

        if (!this.currLocation && (this.street == '' || this.city == '' || this.state == 'null'))
        {
            return;
        }
        
        document.getElementById("invalidAddress").hidden = true;
        document.getElementById('prog-bar').hidden = false;
        this.searchService.clearSearchResults();
        document.getElementById('pills-results-tab').click();
        document.getElementById('currentlyTab').click();
   
        console.log("Form Submitted!");

        this.searchService.fetchWeather(this.street, this.city, this.state, this.currLocation);

    }

    //clears the form inputs and search results
    clearForm(myForm)
    {
        this.searchService.clearSearchResults();
        document.getElementById("invalidAddress").hidden = true;
        myForm.reset();
        this.disableStreet = false;
        this.disableCity = false;
        this.disableState = false;
        this.currLocation = false;
    }

    //currLocation checkbox was clicked
    checkCurrLocation(checkBox)
    {
        if (checkBox.checked)
        {
            this.currLocation = true;
            this.disableStreet = true;
            this.disableCity = true;
            this.disableState = true;
        }
        
        else
        {
            this.currLocation = false;
            this.disableStreet = false;
            this.disableCity = false;
            this.disableState = false;
        }
    }

    //makes http requests for automcompletion on the city input
    autoComplete()
    {
        var params = {params: {city: this.cityText}};
        this.http.get('http://www.ngweatherappnodejs-env-1.eba-ti3uemnm.us-east-2.elasticbeanstalk.com/autoComplete', params)
            .subscribe((jsonData) => 
            {
                console.log(jsonData);
                this.autoCompleteJson = jsonData;
                this.autoCompleteList = [];
                for (var i = 0; i < this.autoCompleteJson.predictions.length; ++i)
                {
                    var match = this.autoCompleteJson.predictions[i].structured_formatting.main_text;
                    this.autoCompleteList.push(match)
                }
            })
    } 
}