import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { HttpClient } from "@angular/common/http";
import * as CanvasJS from '../canvasjs.min';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-weekly-chart',
    templateUrl: './weekly-chart.component.html',
    styleUrls: ['./weekly-chart.component.css']
})
export class WeeklyChartComponent implements OnInit, OnDestroy
{   
    forecastJSON: any = null;
    modalJson: any = null;
    showModal = false;
    modalTime: any;
    street = "";
    city = "";
    state = "";
    lat: any;
    lng: any;

    private forecastSub: Subscription;

    weatherIcons = {'clear-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'clear-night' :'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'rain': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png',
    'snow': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png',
    'sleet': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png',
    'wind': 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png',
    'fog': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
    'cloudy': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png',
    'partly-cloudy-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png',
    'partly-cloudy-night': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png'};


    constructor(private searchService: SearchService, private http: HttpClient) {};

    ngOnInit()
    {
        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON
                this.city = forecastJSON["forecast"]["city"];
                this.lat = forecastJSON["forecast"]["latitude"];
                this.lng = forecastJSON["forecast"]["latitude"];
                this.generateRangeChart();

        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
    }

    //generate the range chart under the weekly tab
    generateRangeChart()
    {
       
        var weeklyData = [ ]
        var xAxis = 10;
        var xAxisTimes = { };
        for (var i = 0; i < 8; ++i)
        {

            var date: any;
            date = new Date((this.forecastJSON.forecast.daily.data[i].time)*1000);
            date = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
            
            weeklyData.push({x: xAxis*(i+1), y: [Math.round(this.forecastJSON.forecast.daily.data[i].temperatureLow), Math.round(this.forecastJSON.forecast.daily.data[i].temperatureHigh)], 
                label: date});
            xAxisTimes[xAxis*(i+1)]=this.forecastJSON.forecast.daily.data[i].time;
        }

        setTimeout( () => {
    
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: false,
            title: {
                text: "Weekly Weather"
            },
            legend: {
                verticalAlign: "top"
            },
            axisX: {
                title: "Days",
                
            },
            dataPointMaxWidth: 20,
            axisY: {
                includeZero: false,
                title: "Temperature in Fahrenheit",
                interval: 10,
            }, 
            data: [{
                click: (e) => {
                    var params = {params: {time: xAxisTimes[e.dataPoint.x], street: this.street, city: this.city, state:this.state, lat: this.lat, lng: this.lng} };
                    this.http.get('http://www.NgWeatherAppNodeJs-env-1.eba-ti3uemnm.us-east-2.elasticbeanstalk.com/modalData', params)
                        .subscribe((jsonData) => 
                        {    
                            console.log(jsonData);
                            
                            this.modalJson = jsonData;
                            
                            this.modalTime = new Date((this.modalJson.currently.time)*1000);
                            this.modalTime = (this.modalTime.getMonth()+1) + '/' + this.modalTime.getDate()+ '/' + this.modalTime.getFullYear();
                            this.showModal = true;

                            var modalButton = document.getElementById("modalButton");
                            modalButton.click();                  
                           
                        });
                },
                color: "#90CCE8",
                type: "rangeBar",
                showInLegend: true,
                yValueFormatString: "#0.#",
                indexLabel: "{y[#index]}",
                legendText: "Day wise temperature range",
                toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
                dataPoints: weeklyData
                
            }]
    
        });
        chart.render();},200)
    }

    
}