import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-journey',
  imports: [],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css'
})
export class JourneyComponent implements OnInit {
  private map: L.Map | undefined;

  ngOnInit(): void {
    setTimeout(() => {
      // Initialize the map
      this.map = L.map('map', {
        center: [51.505, -0.09], // Initial map center [latitude, longitude]
        zoom: 13,               // Initial zoom level
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    }, 100)
  }
}
