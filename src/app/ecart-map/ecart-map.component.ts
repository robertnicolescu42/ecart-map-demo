import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

interface PartialStopper {
  id: string;
  data: {
    description?: string;
    distance?: number;
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
  isEditMode = false;
  showNewStopperDialog = false;
  newStopper: PartialStopper = {
    id: '',
    data: {
      description: '',
      distance: 1,
    },
  };
  padding = 50;
  originalStoppers = [];
  // stoppers: Stopper[] = [];
  stoppers: Stopper[] = [
    //   // First row
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
  directionClicked: string | null = null;
  hoveredStopper = null;
  svgDimensions = { width: 0, height: 0 };
  selectedStopper = null;

  contextualMenuVisible = false;
  menuPosition = { x: 0, y: 0 };
  hasChanges = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.stoppers.length === 0) {
      this.contextualMenuVisible = true;
      this.showNewStopperDialog = true;
      this.enterEditMode();
      this.selectedStopper = {
        id: '',
        x: 50,
        y: 50,
        color: 'blue',
        connections: { N: null, S: null, E: null, W: null },
        data: {
          eCartId: '',
          description: '',
          arrivalTime: '12:00',
          isEcartAvailable: false,
        },
      };
    }
    this.updateSvgDimensions();
  }

  getStopperById(id: string) {
    return this.stoppers.find((stopper) => stopper.id === id);
  }

  showDetails(stopper) {
    this.hoveredStopper = stopper;
  }

  hideDetails() {
    this.hoveredStopper = null;
  }

  onStopperClick(stopper, event) {
    this.showNewStopperDialog = false;
    this.selectedStopper = stopper;
    this.contextualMenuVisible = true;
    this.menuPosition = { x: event.clientX, y: event.clientY };
  }

  closeMenu() {
    this.contextualMenuVisible = false;
    this.selectedStopper = null;
  }

  addRemoveNeighborLabel(direction: string): string {
    if (this.selectedStopper.id) {
      const currentNeighborId = this.selectedStopper.connections[direction];
      const stopperInDirection = this.getStopperByPosition(
        this.selectedStopper,
        direction
      );

      if (currentNeighborId && stopperInDirection.isLinked) {
        return `Unlink ${direction}`;
      } else if (stopperInDirection.stopper) {
        return `Link ${direction}`;
      }
      return `Add ${direction}`;
    }
    return '';
  }

  getStopperByPosition(stopper: Stopper, direction: string) {
    const offset = 100; // Set offset between neighboring stoppers

    let deltaX = 0;
    let deltaY = 0;

    if (direction === 'N') deltaY = -offset;
    if (direction === 'S') deltaY = offset;
    if (direction === 'E') deltaX = offset;
    if (direction === 'W') deltaX = -offset;

    const foundStopper = this.stoppers.find(
      (s) => s.x === stopper.x + deltaX && s.y === stopper.y + deltaY
    );

    return {
      stopper: foundStopper,
      isLinked: this.isStopperLinked(stopper, foundStopper),
    };
  }

  isStopperLinked(stopper1: Stopper, stopper2: Stopper | undefined): boolean {
    if (!stopper2) return false;
    Object.keys(stopper1.connections).forEach((connection) => {
      if (stopper1.connections[connection] === stopper2?.id) {
        return true;
      }
      return false;
    });

    return true;
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
    ).stopper;

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
      // If no existing stopper, check if we can add a new one
      if (this.canAddStopperInDirection(direction)) {
        this.showNewStopperDialog = true;
        this.directionClicked = direction;
      } else {
        alert('Cannot add stopper. Another stopper exists in between.');
      }
    }
    this.hasChanges = true;
  }

  canAddStopperInDirection(direction: string): boolean {
    const distance = this.newStopper.data.distance || 1;
    const step = 100 * distance;
    let deltaX = 0,
      deltaY = 0;

    switch (direction) {
      case 'N':
        deltaY = -step;
        break;
      case 'S':
        deltaY = step;
        break;
      case 'E':
        deltaX = step;
        break;
      case 'W':
        deltaX = -step;
        break;
    }

    const targetX = this.selectedStopper.x + deltaX;
    const targetY = this.selectedStopper.y + deltaY;

    // Check for any stoppers between current and target position
    for (let i = 1; i <= distance; i++) {
      const checkX = this.selectedStopper.x + (deltaX / distance) * i;
      const checkY = this.selectedStopper.y + (deltaY / distance) * i;
      if (this.stoppers.find((s) => s.x === checkX && s.y === checkY)) {
        return false;
      }
    }
    return true;
  }

  cancelAddingOfNewStopper() {
    this.newStopper = {
      id: '',
      data: {
        description: '',
        distance: 1,
      },
    };

    this.showNewStopperDialog = false;
  }

  saveNewStopper() {
    let direction = this.directionClicked;
    const oppositeDirection = {
      N: 'S',
      S: 'N',
      E: 'W',
      W: 'E',
    };

    const newNeighborId = this.newStopper.id;

    // Check for duplicate stopper ID
    if (this.getStopperById(newNeighborId)) {
      alert('A stopper with this ID already exists.');
      return;
    }

    const newStoppedDescription = this.newStopper.data.description;
    const distance = this.newStopper.data.distance || 1;
    const step = 100 * distance;

    const newStopper: Stopper = {
      id: newNeighborId,
      x: this.selectedStopper.x,
      y: this.selectedStopper.y,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: null },
      data: {
        eCartId: '',
        description: newStoppedDescription,
        arrivalTime: '00:00',
        isEcartAvailable: false,
      },
    };

    // Set position based on direction and distance
    switch (direction) {
      case 'N':
        newStopper.y -= step;
        break;
      case 'S':
        newStopper.y += step;
        break;
      case 'E':
        newStopper.x += step;
        break;
      case 'W':
        newStopper.x -= step;
        break;
    }

    newStopper.connections[oppositeDirection[direction]] =
      this.selectedStopper.id;
    this.selectedStopper.connections[direction] = newNeighborId;
    this.stoppers.push(newStopper);

    this.hasChanges = true;
    this.updateSvgDimensions();
    this.cancelAddingOfNewStopper();
    this.cdr.markForCheck();
    this.directionClicked = null;
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
    this.hasChanges = true;
    this.updateSvgDimensions();
    this.cdr.markForCheck();
    this.closeMenu();
  }

  editStopper() {
    // placeholder
    this.closeMenu();
  }

  updateSvgDimensions() {
    const minX = Math.min(...this.stoppers.map((stopper) => stopper.x));
    const minY = Math.min(...this.stoppers.map((stopper) => stopper.y));
    const maxX = Math.max(...this.stoppers.map((stopper) => stopper.x));
    const maxY = Math.max(...this.stoppers.map((stopper) => stopper.y));

    // Adjust the coordinates of stoppers based on minimum values,
    // since having negative values will case the SVG to not render the new stopper
    this.stoppers.forEach((stopper) => {
      stopper.x = stopper.x - minX + this.padding;
      stopper.y = stopper.y - minY + this.padding;
    });

    let calculatedWidth = maxX - minX + 2 * this.padding;
    let calculatedHeight = maxY - minY + 2 * this.padding;
    this.svgDimensions = {
      width: calculatedWidth > 0 ? calculatedWidth : 300,
      height: calculatedHeight > 0 ? calculatedHeight : 100,
    };
    this.cdr.detectChanges();
  }

  enterEditMode() {
    this.isEditMode = true;
    this.originalStoppers = JSON.parse(JSON.stringify(this.stoppers)); // Deep copy of stoppers
    this.hasChanges = false;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.contextualMenuVisible = false;
    this.selectedStopper = null;
    this.showNewStopperDialog = false;
    this.stoppers = JSON.parse(JSON.stringify(this.originalStoppers)); // Revert to original state
    this.hasChanges = false;
  }

  // Save edit mode changes
  saveEdit() {
    this.isEditMode = false;
    this.hasChanges = false;
    this.selectedStopper = null;
    this.applyChanges();
  }

  applyChanges() {
    // save the file to s3
    console.log('Changes saved.');
  }
}
