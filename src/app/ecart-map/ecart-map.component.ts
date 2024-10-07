import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';

interface Stopper {
  id: string;
  x: number;
  y: number;
  color?: string;
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
  emptyStopper: PartialStopper = {
    id: '',
    data: {
      description: '',
      distance: 1,
    },
  };
  // Deep copy of emptyStopper to avoid reference issues
  newStopper: PartialStopper = this.deepClone(this.emptyStopper);
  padding = 50;
  originalStoppers = [];
  stoppers: Stopper[] = [
    //   // First row
    {
      id: 'stopper1',
      x: 50,
      y: 50,
      color: 'blue',
      connections: { N: null, S: 'stopper4', E: null, W: null },
      data: {
        eCartId: 'e123',
        description: 'Stopper 1',
        arrivalTime: '12:00',
        isEcartAvailable: true,
      },
    },
    // {
    //   id: 'stopper2',
    //   x: 150,
    //   y: 50,
    //   color: 'red',
    //   connections: { N: null, S: 'stopper5', E: 'stopper3', W: 'stopper1' },
    //   data: {
    //     eCartId: 'e124',
    //     description: 'Stopper 2',
    //     arrivalTime: '12:05',
    //     isEcartAvailable: false,
    //   },
    // },
    {
      id: 'stopper3',
      x: 250,
      y: 50,
      color: 'blue',
      connections: { N: null, S: null, E: null, W: null },
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
  // stoppers: Stopper[] = [];
  directionClicked: string | null = null;
  hoveredStopper = null;
  svgDimensions = { width: 0, height: 0 };
  selectedStopper = null;

  contextualMenuVisible = false;
  menuPosition = { x: 0, y: 0 };
  hasChanges = false;
  tempStopper: Stopper | null = null;
  maxDistance = 5;
  arrayOfDistances: number[] = Array.from(Array(this.maxDistance)).map(
    (e, i) => i + 1
  ); // This will create an array from 1 to maxDistance

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.stoppers.length === 0) {
      // Add a default stopper if none exist
      this.contextualMenuVisible = true;
      this.showNewStopperDialog = true;
      this.enterEditMode();
      this.selectedStopper = {
        id: '',
        x: 150,
        y: 50,
        connections: { N: null, S: null, E: null, W: null },
        data: {
          eCartId: '',
          description: '',
          arrivalTime: '12:00',
          isEcartAvailable: false,
        },
      };
      this.updateSvgDimensions({
        x: this.selectedStopper.x,
        y: this.selectedStopper.y,
      });
      this.tempStopper = this.selectedStopper;
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

  /**
   * Determines the appropriate label for adding or removing a neighbor stopper in a given direction.
   *
   * @param direction - The direction in which to add or remove the neighbor stopper (e.g., 'north', 'south', 'east', 'west').
   * @returns A string label indicating the action to be taken (e.g., 'Unlink north', 'Link south', 'Add east').
   */
  addRemoveNeighborLabel(direction: string): string {
    // TODO - fix label logic, what happens when you have an unlinked neighbor two spaces away and you want to link it with one click?
    if (this.selectedStopper) {
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

  /**
   * Adds or removes a neighbor stopper in the specified direction.
   *
   * This method handles the logic for adding or removing a connection
   * between the currently selected stopper and another stopper in the
   * specified direction. If a connection already exists, it will be removed.
   * If no connection exists, it will attempt to create one.
   *
   * @param direction - The direction in which to add or remove a neighbor stopper.
   *                    Valid values are 'N', 'S', 'E', 'W'.
   *
   * The method performs the following steps:
   * 1. Determines the opposite direction.
   * 2. Retrieves the current neighbor stopper ID in the specified direction.
   * 3. Finds the stopper in the specified direction.
   * 4. If a connection exists, it removes the connection.
   * 5. If no connection exists but a stopper is found in the direction, it links to the existing stopper.
   * 6. If no stopper is found, it checks if a new stopper can be added in the direction.
   * 7. If a new stopper can be added, it shows a dialog to add a new stopper.
   * 8. If a new stopper cannot be added, it alerts the user.
   */
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
        this.updateTempStopperPosition(
          this.newStopper.data.distance || 1,
          direction
        );
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
    this.newStopper = this.deepClone(this.emptyStopper);

    this.showNewStopperDialog = false;
    this.tempStopper = null;
    this.updateSvgDimensions();
  }

  /**
   * Saves a new stopper to the map. This function performs several tasks:
   * - Checks for duplicate stopper IDs and alerts the user if a duplicate is found.
   * - Creates a new stopper object with the specified properties.
   * - Sets the position of the new stopper based on the direction and distance.
   * - Updates the connections between the new stopper and the selected stopper.
   * - Adds the new stopper to the list of stoppers.
   * - Marks the component as having changes.
   * - Updates the SVG dimensions.
   * - Cancels the process of adding a new stopper.
   * - Marks the component for change detection.
   * - Resets temporary variables and sets the new stopper as the selected stopper.
   * - Clones an empty stopper template for future use.
   */
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
    this.tempStopper = null;
    this.directionClicked = null;
    this.selectedStopper = newStopper;
    this.newStopper = this.deepClone(this.emptyStopper);
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

  /**
   * Updates the dimensions of the SVG element based on the positions of stoppers.
   * If a temporary stopper distance is provided, it includes the temporary stopper
   * in the calculation of the dimensions.
   *
   * @param tempStopperDistance - Optional parameter representing the x and y coordinates
   *                              of a temporary stopper to be considered in the calculations.
   *                              If not provided, only the existing stoppers are considered.
   *
   * The method calculates the minimum and maximum x and y coordinates among the stoppers,
   * adjusts the coordinates of the stoppers based on the minimum values, and then calculates
   * the width and height of the SVG element. The dimensions are set to a minimum of 300x100
   * if the calculated dimensions are less than these values.
   */
  updateSvgDimensions(tempStopperDistance?: { x: number; y: number }) {
    const stoppersToConsider: any[] = [...this.stoppers];

    // If tempStopperDistance is provided, calculate the temporary stopper's position
    if (tempStopperDistance) {
      const tempStopper = {
        x: tempStopperDistance.x,
        y: tempStopperDistance.y,
      };
      stoppersToConsider.push(tempStopper);
    }

    const minX = Math.min(...stoppersToConsider.map((stopper) => stopper.x));
    const minY = Math.min(...stoppersToConsider.map((stopper) => stopper.y));
    const maxX = Math.max(...stoppersToConsider.map((stopper) => stopper.x));
    const maxY = Math.max(...stoppersToConsider.map((stopper) => stopper.y));

    // Adjust the coordinates of stoppers based on minimum values
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
    this.originalStoppers = this.deepClone(this.stoppers); // Deep copy of stoppers
    this.hasChanges = false;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.contextualMenuVisible = false;
    this.tempStopper = null;
    this.selectedStopper = null;
    this.showNewStopperDialog = false;
    this.stoppers = this.deepClone(this.originalStoppers); // Revert to original state
    this.hasChanges = false;
    this.updateSvgDimensions();
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

  /**
   * Updates the position of a temporary stopper based on the given distance and direction.
   *
   * @param distance - The distance to move the stopper.
   * @param direction - The direction to move the stopper ('N' for North, 'S' for South, 'E' for East, 'W' for West).
   *
   * This method calculates the new position of a temporary stopper by adjusting its coordinates
   * based on the specified distance and direction. It then updates the `tempStopper` object with
   * the new position and triggers change detection and SVG dimension updates.
   */
  updateTempStopperPosition(distance: number, direction: string) {
    if (!this.selectedStopper) return;

    const step = 100 * distance; // Distance multiplier for positioning
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

    this.tempStopper = {
      id: 'temp',
      x: this.selectedStopper.x + deltaX,
      y: this.selectedStopper.y + deltaY,
      color: 'transparent',
      connections: { N: null, S: null, E: null, W: null },
      data: {
        eCartId: '',
        description: 'Temporary Stopper',
        arrivalTime: '',
        isEcartAvailable: false,
      },
    };

    this.cdr.markForCheck();
    this.updateSvgDimensions({ x: this.tempStopper.x, y: this.tempStopper.y });
  }

  addTempStopper(stop: Stopper) {
    this.tempStopper = stop;

    setTimeout(() => {
      this.fadeOutTempStopper();
    }, 3000);
  }

  fadeOutTempStopper() {
    const stopperEl = document.getElementById(
      `temp-stopper-${this.tempStopper?.id}`
    );
    if (stopperEl) {
      stopperEl.classList.add('fade-out');
      setTimeout(() => {
        this.tempStopper = null;
      }, 1000);
    }
  }

  onDistanceChange(newDistance: number) {
    this.newStopper.data.distance = newDistance;
    if (this.directionClicked) {
      this.updateTempStopperPosition(newDistance, this.directionClicked);
    }
  }

  deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
