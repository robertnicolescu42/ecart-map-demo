import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EcartMapComponent } from './ecart-map/ecart-map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EcartMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ecart-map-demo';
}
