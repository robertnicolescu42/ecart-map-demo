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
    eCartId: string | null;
    description: string;
    arrivalTime: string | null;
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
  // TODO: change label of the contextual menu to say Unlink for already linked distant stoppers
  // also, don't let the users add a new stopper that's after an existing stopper
  // (e.g.if there's a stopper at 1,1 and one at 1,3 don't let the user add a stopper at 1,4 from the 1,1 one)
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
  stoppers = [
    {
      id: '1',
      x: 50,
      y: 150,
      connections: {
        N: null,
        S: null,
        E: '2',
        W: null,
        undefined: '',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '2',
      x: 150,
      y: 150,
      connections: {
        N: null,
        S: '5',
        E: '3',
        W: '1',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '3',
      x: 250,
      y: 150,
      connections: {
        N: null,
        S: '6',
        E: '4',
        W: '2',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '4',
      x: 350,
      y: 150,
      connections: {
        N: null,
        S: null,
        E: null,
        W: '3',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '5',
      x: 150,
      y: 250,
      connections: {
        N: '2',
        S: null,
        E: '6',
        W: '7',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '6',
      x: 250,
      y: 250,
      connections: {
        N: '3',
        S: null,
        E: '8',
        W: '5',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '7',
      x: 50,
      y: 250,
      connections: {
        N: null,
        S: null,
        E: '5',
        W: null,
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '8',
      x: 350,
      y: 250,
      connections: {
        N: null,
        S: null,
        E: '9',
        W: '6',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '9',
      x: 550,
      y: 250,
      connections: {
        N: '10',
        S: null,
        E: '15',
        W: '8',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '10',
      x: 550,
      y: 150,
      connections: {
        N: '11',
        S: '9',
        E: '12',
        W: null,
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '11',
      x: 550,
      y: 50,
      connections: {
        N: null,
        S: '10',
        E: null,
        W: null,
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '12',
      x: 650,
      y: 150,
      connections: {
        N: null,
        S: '15',
        E: '13',
        W: '10',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '13',
      x: 1050,
      y: 150,
      connections: {
        N: null,
        S: null,
        E: null,
        W: '12',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '15',
      x: 650,
      y: 250,
      connections: {
        N: '12',
        S: '16',
        E: null,
        W: '9',
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
      },
    },
    {
      id: '16',
      x: 650,
      y: 350,
      connections: {
        N: '15',
        S: null,
        E: null,
        W: null,
      },
      data: {
        eCartId: '',
        description: '',
        arrivalTime: null,
        isEcartAvailable: false,
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
  tempStopper: Stopper | null = null;
  maxDistance = 5;
  arrayOfDistances: number[] = Array.from(Array(this.maxDistance)).map(
    (e, i) => i + 1
  ); // This will create an array from 1 to maxDistance
  isLinking: boolean = false;

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
          eCartId: null,
          description: '',
          arrivalTime: null,
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
    this.onDistanceChange(1, true);
    this.tempStopper = null;
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

  getStopperByPosition(
    stopper: Stopper,
    direction: string,
    distance: number = 1
  ) {
    const offset = 100 * distance;

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

    const distance = this.newStopper.data.distance || 1;
    const stopperInDirection = this.getStopperByPosition(
      this.selectedStopper,
      direction,
      distance
    ).stopper;
    if (stopperInDirection) {
      // If a stopper already exists at this distance and it is not linked, just link them
      if (
        stopperInDirection.connections[oppositeDirection[direction]] !==
        this.selectedStopper.id
      ) {
        this.selectedStopper.connections[direction] = stopperInDirection.id;
        stopperInDirection.connections[oppositeDirection[direction]] =
          this.selectedStopper.id;
      } else {
        // If there is a stopper in that direction and they are linked, unlink them
        this.selectedStopper.connections[direction] = null;
        stopperInDirection.connections[oppositeDirection[direction]] = null;
      }
    } else if (this.canAddStopperInDirection(direction)) {
      // No stopper exists, show dialog to add new stopper
      this.showNewStopperDialog = true;
      this.directionClicked = direction;
      this.updateTempStopperPosition(distance, direction);
    } else {
      alert('Cannot add stopper. Another stopper exists in between.');
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
    // for some reason the connections aren't properly updated for the new stopper, but they are
    // updated for the stopper it links to. this still lets the component work properly
    // but it's not good practice to leave it like this
    if (!this.isLinking) {
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
          arrivalTime: null,
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
      this.selectedStopper = newStopper;
    } else {
      const stopperInPosition = this.getStopperByPosition(
        this.selectedStopper,
        this.directionClicked,
        this.newStopper.data.distance
      ).stopper;
      this.linkDistantStoppers(
        stopperInPosition,
        this.newStopper.data.distance,
        this.directionClicked
      );
    }

    this.hasChanges = true;
    this.updateSvgDimensions();
    this.cancelAddingOfNewStopper();
    this.cdr.markForCheck();
    this.tempStopper = null;
    this.directionClicked = null;
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
    this.contextualMenuVisible = false;

    this.isLinking = false;
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
        eCartId: null,
        description: 'Temporary Stopper',
        arrivalTime: null,
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

  onDistanceChange(newDistance: number, init: boolean = false) {
    this.isLinking = false;
    this.newStopper.data.distance = newDistance;

    if (init) {
      return;
    }

    if (this.directionClicked) {
      this.updateTempStopperPosition(newDistance, this.directionClicked);

      // check if the new stopper overlaps an existing one at this distance and direction,
      // and if it does, just link it to that one
      const stopperInDirection = this.getStopperByPosition(
        this.selectedStopper,
        this.directionClicked,
        newDistance
      ).stopper;
      if (stopperInDirection) {
        this.isLinking = true;
      }
    }
  }

  linkDistantStoppers(stopperInDirection, distance, direction) {
    const oppositeDirection = {
      N: 'S',
      S: 'N',
      E: 'W',
      W: 'E',
    };

    if (stopperInDirection) {
      // If a stopper already exists at this distance and it is not linked, just link them
      if (
        stopperInDirection.connections[oppositeDirection[direction]] !==
        this.selectedStopper.id
      ) {
        this.selectedStopper.connections[direction] = stopperInDirection.id;
        stopperInDirection.connections[oppositeDirection[direction]] =
          this.selectedStopper.id;
      } else {
        // If there is a stopper in that direction and they are linked, unlink them
        this.selectedStopper.connections[direction] = null;
        stopperInDirection.connections[oppositeDirection[direction]] = null;
      }
    }
  }

  deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
