import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search-service/search.service';


@Component({
    selector: 'app-hourly-charts',
    templateUrl: './hourly-charts.component.html',
    styleUrls: ['./hourly-charts.component.css']
})
export class HourlyChartsComponent implements OnInit, OnDestroy
{
    forecastJSON: any = null;
    showResults = false;
    chartParameter = 1;

    //chart.js variables
    tempChartOptions: any;
    tempChartData: any;
    pressChartData: any;
    pressChartOptions: any;
    humidityChartOptions: any;
    humidityChartData: any;
    ozoneChartOptions: any;
    ozoneChartData: any;
    visibilityChartOptions: any;
    visibilityChartData: any;
    windSpeedChartOptions: any;
    windSpeedChartData: any;
    chartLabels: any;
    chartColors: any;

    private forecastSub: Subscription;

    constructor(private searchService: SearchService) {};

    ngOnInit()
    {
        //subscribe to listen to any new weather search results
        this.forecastSub = this.searchService.getForecastUpdateListener()
            .subscribe((forecastJSON) => {
                this.forecastJSON = forecastJSON
                console.log(this.forecastJSON);
                this.showResults = true;
                this.chartParameter = 1;
                this.generateCharts();
        });
    }

    ngOnDestroy()
    {
        this.forecastSub.unsubscribe();
    }

    //generate the charts under the hourly tab
    generateCharts()
    {
        this.chartLabels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        this.chartColors = [
        {
            backgroundColor: '#90CCE8',
            borderColor: '#90CCE8',
            pointBackgroundColor: '#016898',
            pointBorderColor: '#016898',
            pointHoverBackgroundColor: '#016898',
            pointHoverBorderColor: '#016898'
        }]
     
        var tempData = [ ];

        for (var i = 0; i < 24; ++i)
            tempData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].temperature*100)/100);
        
        this.tempChartOptions = {
            responsive: true,
            legend: {
                onClick: function(event, legendItem) {}
            },
            scales: {
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Time difference from current hour'
                },             
            }], 
            yAxes: [{
                scaleLabel: 
                {
                    display: true,
                    labelString: 'Fahrenheit'
                },
                ticks: {
                    suggestedMax: Math.max(...tempData) + 5,
                    precision:0
                }
            }]
        }
        };
       

        this.tempChartData = [
            { data: tempData, label: 'temperature' }
        ];

        var pressData = [ ];

        for (var i = 0; i < 24; ++i)
            pressData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].pressure*100)/100);

        this.pressChartOptions = {
            responsive: true,
            legend: {
                onClick: function(event, legendItem) {}
            },
            scales: { 
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Time difference from current hour'
                }
            }],
            yAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Millibars'
                },
                ticks: {
                    precision:0,
                    suggestedMax: Math.max(...pressData) + 1
                }
            }]
            }
        };


        this.pressChartData = [
            { data: pressData, label: 'pressure' }
        ];

        var humidityData = [ ];

        for (var i = 0; i < 24; ++i)
            humidityData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].humidity*100*100)/100);

        this.humidityChartOptions = {
        responsive: true,
        legend: {
            onClick: function(event, legendItem) {}
        },
        scales: {
        xAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
            }
        }], 
        yAxes: [{
            scaleLabel: 
            {
                display: true,
                labelString: '% Humidity'
            },
            ticks: {
                suggestedMax: Math.max(...humidityData) + 5,
                precision:0
            }
        }]
        }
        };

        this.humidityChartData = [
            { data: humidityData, label: 'humidity' }
        ];

        var ozoneData = [ ];

        for (var i = 0; i < 24; ++i)
            ozoneData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].ozone*100)/100);

        this.ozoneChartOptions = {
            responsive: true,
            legend: {
                onClick: function(event, legendItem) {}
            },
            scales: { 
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Time difference from current hour'
                }
            }],
            yAxes: [{
                scaleLabel: 
                {
                    display: true,
                    labelString: 'Dobson Units'
                },
                ticks: {
                    suggestedMax: Math.max(...ozoneData) + 1,
                    precision:0
                }
            }]
            }
            };


        this.ozoneChartData = [
            { data: ozoneData, label: 'ozone' }
        ];

        this.visibilityChartOptions = {
            responsive: true,
            legend: {
                onClick: function(event, legendItem) {}
            },
            scales: { 
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Time difference from current hour'
                }
            }],
            yAxes: [{
                scaleLabel: 
                {
                    display: true,
                    labelString: 'Miles (Maximum 10)'
                },
                ticks: {
                    suggestedMax: 12,
                    precision:0
                }
            }]
            }
            };
    
        var visibilityData = [ ];

        for (var i = 0; i < 24; ++i)
            visibilityData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].visibility*100)/100);

        this.visibilityChartData = [
            { data: visibilityData, label: 'visibility' }
        ];

        this.windSpeedChartOptions = {
            responsive: true,
            legend: {
                onClick: function(event, legendItem) {}
            },
            scales: { 
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Time difference from current hour'
                }
            }],
            yAxes: [{
                scaleLabel: 
                {
                    display: true,
                    labelString: 'Miles per Hour'
                },
                ticks: {
                    suggestedMax: 9,
                    precision:0
                }
            }]
            }
            };
    
        var windSpeedData = [ ];

        for (var i = 0; i < 24; ++i)
            windSpeedData.push(Math.round(this.forecastJSON.forecast.hourly.data[i].windSpeed*100)/100);

        this.windSpeedChartData = [
            { data: windSpeedData, label: 'windSpeed' }
        ];
    }

}