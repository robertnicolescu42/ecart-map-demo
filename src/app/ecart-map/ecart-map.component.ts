import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';

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
    isEcartAvailable: boolean;
  };
}

@Component({
  selector: 'app-ecart-map',
  standalone: true,
  imports: [CommonModule, TooltipModule, FormsModule],
  templateUrl: './ecart-map.component.html',
  styleUrl: './ecart-map.component.css',
})
export class EcartMapComponent implements OnInit {
  @Input()
  editMode = false;

  padding = 50;
  stoppers: Stopper[] = [
    // First row
    {
      id: 'stopper1',
      x: 50,
      y: 50,
      color: 'blue',
      connections: { N: null, S: null, E: 'stopper2', W: null },
      data: {
        eCartId: 'e123',
        description: 'Stopper 1',
        arrivalTime: '12:00',
        isEcartAvailable: true,
      },
    },
    {
      id: 'stopper2',
      x: 150,
      y: 50,
      color: 'red',
      connections: { N: null, S: null, E: 'stopper3', W: 'stopper1' },
      data: {
        eCartId: 'e124',
        description: 'Stopper 2',
        arrivalTime: '12:05',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper3',
      x: 250,
      y: 50,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper2' },
      data: {
        eCartId: 'e125',
        description: 'Stopper 3',
        arrivalTime: '12:10',
        isEcartAvailable: true,
      },
    },

    // Second row
    {
      id: 'stopper4',
      x: 50,
      y: 150,
      color: 'yellow',
      connections: { N: 'stopper1', S: 'stopper7', E: 'stopper5', W: null },
      data: {
        eCartId: 'e126',
        description: 'Stopper 4',
        arrivalTime: '12:15',
        isEcartAvailable: true,
      },
    },
    {
      id: 'stopper5',
      x: 150,
      y: 150,
      color: 'blue',
      connections: { N: null, S: null, E: 'stopper6', W: 'stopper4' },
      data: {
        eCartId: 'e127',
        description: 'Stopper 5',
        arrivalTime: '12:20',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper6',
      x: 250,
      y: 150,
      color: 'blue',
      connections: { N: null, S: null, E: 'stopper6.1', W: 'stopper5' },
      data: {
        eCartId: 'e128',
        description: 'Stopper 6',
        arrivalTime: '12:25',
        isEcartAvailable: true,
      },
    },

    {
      id: 'stopper6.1',
      x: 350,
      y: 150,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper6' },
      data: {
        eCartId: 'e128',
        description: 'Stopper 6.1',
        arrivalTime: '12:25',
        isEcartAvailable: true,
      },
    },

    // Third row
    {
      id: 'stopper7',
      x: 50,
      y: 250,
      color: 'blue',
      connections: { N: 'stopper4', S: null, E: 'stopper8', W: null },
      data: {
        eCartId: 'e129',
        description: 'Stopper 7',
        arrivalTime: '12:30',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper8',
      x: 150,
      y: 250,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: 'stopper7' },
      data: {
        eCartId: 'e130',
        description: 'Stopper 8',
        arrivalTime: '12:35',
        isEcartAvailable: true,
      },
    },
  ];
  hoveredStopper = null;
  svgDimensions = { width: 0, height: 0 };
  selectedStopper = null;

  contextualMenuVisible = false;
  menuPosition = { x: 0, y: 0 };
  possibleStoppers = [
    {
      id: 'stopper1',
      data: {
        description: 'Stopper 1',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper2',
      data: {
        description: 'Stopper 2',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper3',
      data: {
        description: 'Stopper 3',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper4',
      data: {
        description: 'Stopper 4',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper5',
      data: {
        description: 'Stopper 5',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper6',
      data: {
        description: 'Stopper 6',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper7',
      data: {
        description: 'Stopper 7',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper8',
      data: {
        description: 'Stopper 8',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper9',
      data: {
        description: 'Stopper 9',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper10',
      data: {
        description: 'Stopper 10',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper11',
      data: {
        description: 'Stopper 11',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
    {
      id: 'stopper12',
      data: {
        description: 'Stopper 12',
        eCartId: '',
        isEcartAvailable: false,
      },
    },
  ];

  ngOnInit(): void {
    this.updateSvgDimensions();
  }

  getStopperById(id: string) {
    return this.stoppers.find((stopper) => stopper.id === id);
  }

  showDetails(stopper) {
    console.log('🚀 ~ EcartMapComponent ~ showDetails ~ stopper:', stopper);
    this.hoveredStopper = stopper;
  }

  hideDetails() {
    this.hoveredStopper = null;
  }

  onStopperClick(stopper, event) {
    this.selectedStopper = stopper;
    this.contextualMenuVisible = true;
    this.menuPosition = { x: event.clientX, y: event.clientY };
  }

  closeMenu() {
    this.contextualMenuVisible = false;
    this.selectedStopper = null;
  }

  addRemoveNeighborLabel(direction: string): string {
    const currentNeighborId = this.selectedStopper.connections[direction];
    const stopperInDirection = this.getStopperByPosition(
      this.selectedStopper,
      direction
    );

    if (currentNeighborId) {
      return `Remove ${direction}`;
    } else if (stopperInDirection) {
      return `Link to ${direction}`;
    } else {
      return `Add ${direction}`;
    }
  }

  getStopperByPosition(
    stopper: Stopper,
    direction: string
  ): Stopper | undefined {
    const offset = 100; // Set offset between neighboring stoppers

    let deltaX = 0;
    let deltaY = 0;

    if (direction === 'N') deltaY = -offset;
    if (direction === 'S') deltaY = offset;
    if (direction === 'E') deltaX = offset;
    if (direction === 'W') deltaX = -offset;

    return this.stoppers.find(
      (s) => s.x === stopper.x + deltaX && s.y === stopper.y + deltaY
    );
  }

  addRemoveNeighbor(direction: string) {
    const oppositeDirection = {
      N: 'S',
      S: 'N',
      E: 'W',
      W: 'E',
    };

    const currentNeighborId = this.selectedStopper.connections[direction];
    const stopperInDirection = this.getStopperByPosition(
      this.selectedStopper,
      direction
    );

    if (currentNeighborId) {
      // If there's already a connection, remove it
      const neighborStopper = this.getStopperById(currentNeighborId);
      neighborStopper.connections[oppositeDirection[direction]] = null;
      this.selectedStopper.connections[direction] = null;
    } else if (stopperInDirection) {
      // Link to the existing stopper in the direction
      this.selectedStopper.connections[direction] = stopperInDirection.id;
      stopperInDirection.connections[oppositeDirection[direction]] =
        this.selectedStopper.id;
    } else {
      const newNeighborId = prompt('Enter the ID of the new neighbor');
      const newNeighborStopper = this.getStopperById(newNeighborId);
      if (newNeighborStopper) {
        this.selectedStopper.connections[direction] = newNeighborId;
        newNeighborStopper.connections[oppositeDirection[direction]] =
          this.selectedStopper.id;
      }
    }
  }

  removeStopper() {
    const stopperId = this.selectedStopper.id;

    // Remove references to this stopper from neighbors
    Object.keys(this.selectedStopper.connections).forEach((dir) => {
      const neighborId = this.selectedStopper.connections[dir];
      if (neighborId) {
        const neighborStopper = this.getStopperById(neighborId);
        const oppositeDirection = { N: 'S', S: 'N', E: 'W', W: 'E' };
        neighborStopper.connections[oppositeDirection[dir]] = null;
      }
    });

    // Remove the stopper from the array
    this.stoppers = this.stoppers.filter((stopper) => stopper.id !== stopperId);
    this.closeMenu();
  }

  editStopper() {
    // placeholder
    this.closeMenu();
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

  showStopperDropdown = false;
  selectedStopperToAdd = null;
  selectedDirection = '';

  prepareAddStopper(direction: string) {
    this.selectedDirection = direction;
    this.showStopperDropdown = true;
  }

  addStopper(direction: string) {
    if (!this.selectedStopperToAdd) return;
    console.log(
      '🚀 ~ EcartMapComponent ~ addStopper ~ this.selectedStopperToAdd:',
      this.selectedStopperToAdd
    );

    const newStopper = { ...this.selectedStopperToAdd };
    const oppositeDirection = { N: 'S', S: 'N', E: 'W', W: 'E' };

    // Calculate the position based on direction
    const offset = 100;
    let newX = this.selectedStopper.x;
    let newY = this.selectedStopper.y;

    if (direction === 'N') newY -= offset;
    if (direction === 'S') newY += offset;
    if (direction === 'E') newX += offset;
    if (direction === 'W') newX -= offset;

    // Update the position of the new stopper
    newStopper.x = newX;
    newStopper.y = newY;
    newStopper.connections = { N: null, S: null, E: null, W: null };

    // Link the new stopper to the original stopper ( i sometimes feel like methods need some kind of DIVs inside them...)
    newStopper.connections[oppositeDirection[direction]] =
      this.selectedStopper.id;

    // Link the original stopper to the newly added stopper
    this.selectedStopper.connections[direction] = newStopper.id;

    // have to look better at this in the future
    console.log(
      '🚀 ~ EcartMapComponent ~ addStopper ~ newStopper:',
      newStopper
    );

    // Add the new stopper to the stoppers array
    this.stoppers.push(newStopper);

    console.log(
      '🚀 ~ EcartMapComponent ~ addStopper ~ this.stoppers:',
      this.stoppers
    );

    this.showStopperDropdown = false;
    this.updateSvgDimensions();
  }

  prepareAddFirstStopper() {
    this.showStopperDropdown = true;
  }
}
