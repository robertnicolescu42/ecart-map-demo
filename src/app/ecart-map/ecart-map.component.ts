import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

interface Stopper {
  id: string;

  x: number;

  y: number;

  color: string;

  connections: {
    N: string | null;

    S: string | null;

    E: string | null;

    W: string | null;
  };

  data: {
    eCartId: string;

    description: string;

    arrivalTime: string;
  };
}

@Component({
  selector: 'app-ecart-map',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './ecart-map.component.html',
  styleUrl: './ecart-map.component.css',
})
export class EcartMapComponent implements OnInit {
  padding = 50;
  stoppers: Stopper[] = [
    // First row
    {
      id: 'stopper1',
      x: 50,
      y: 50,
      color: 'blue',
      connections: { N: null, S: 'stopper4', E: 'stopper2', W: null },
      data: { eCartId: 'e123', description: 'Stopper 1', arrivalTime: '12:00' },
    },
    {
      id: 'stopper2',
      x: 150,
      y: 50,
      color: 'red',
      connections: { N: null, S: null, E: 'stopper3', W: 'stopper1' },
      data: { eCartId: 'e124', description: 'Stopper 2', arrivalTime: '12:05' },
    },
    {
      id: 'stopper3',
      x: 250,
      y: 50,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper2' },
      data: { eCartId: 'e125', description: 'Stopper 3', arrivalTime: '12:10' },
    },

    // Second row
    {
      id: 'stopper4',
      x: 50,
      y: 150,
      color: 'yellow',
      connections: { N: 'stopper1', S: 'stopper7', E: 'stopper5', W: null },
      data: { eCartId: 'e126', description: 'Stopper 4', arrivalTime: '12:15' },
    },
    {
      id: 'stopper5',
      x: 150,
      y: 150,
      color: 'blue',
      connections: { N: null, S: null, E: 'stopper6', W: 'stopper4' },
      data: { eCartId: 'e127', description: 'Stopper 5', arrivalTime: '12:20' },
    },
    {
      id: 'stopper6',
      x: 250,
      y: 150,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper5' },
      data: { eCartId: 'e128', description: 'Stopper 6', arrivalTime: '12:25' },
    },

    // Third row
    {
      id: 'stopper7',
      x: 50,
      y: 250,
      color: 'blue',
      connections: { N: 'stopper4', S: null, E: 'stopper8', W: null },
      data: { eCartId: 'e129', description: 'Stopper 7', arrivalTime: '12:30' },
    },
    {
      id: 'stopper8',
      x: 150,
      y: 250,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper7' },
      data: { eCartId: 'e130', description: 'Stopper 8', arrivalTime: '12:35' },
    },

    // Fourth row isolated
    {
      id: 'stopper9',
      x: 250,
      y: 350,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: null }, // No connections, isolated stopper
      data: { eCartId: 'e131', description: 'Stopper 9', arrivalTime: '12:40' },
    },
  ];

  hoveredStopper = null;
  tooltipX = 0;
  tooltipY = 0;
  svgDimensions = { width: 0, height: 0 };

  ngOnInit(): void {
    this.updateSvgDimensions();
  }

  getStopperById(id: string) {
    return this.stoppers.find((stopper) => stopper.id === id);
  }

  showDetails(stopper) {
    console.log('🚀 ~ EcartMapComponent ~ showDetails ~ stopper:', stopper);
    this.hoveredStopper = stopper;
    this.tooltipX = stopper.x + 20;
    this.tooltipY = stopper.y - 20;
  }

  hideDetails() {
    this.hoveredStopper = null;
  }

  onStopperClick(stopper) {
    console.log('Stopper clicked:', stopper);
  }

  updateSvgDimensions() {
    const maxX = Math.max(...this.stoppers.map((stopper) => stopper.x));
    const maxY = Math.max(...this.stoppers.map((stopper) => stopper.y));

    // The +50 is just padding
    this.svgDimensions = {
      width: maxX + 50,
      height: maxY + 50,
    };
  }
}
