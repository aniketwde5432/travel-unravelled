export type CardType = 'flight' | 'stay' | 'food' | 'activity' | 'note';

export interface Position {
  x: number;
  y: number;
}

export interface BaseCard {
  id: string;
  type: CardType;
  position: Position;
  title: string;
  cost?: number;
  connections?: string[]; // IDs of connected cards
  imageUrl?: string; // Image for card
  startTime?: string; // Custom start time
  endTime?: string; // Custom end time
}

export interface FlightCard extends BaseCard {
  type: 'flight';
  departure: string;
  arrival: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface StayCard extends BaseCard {
  type: 'stay';
  checkIn: string;
  checkOut: string;
  location: string;
}

export interface FoodCard extends BaseCard {
  type: 'food';
  location: string;
  cuisine?: string;
  time?: string;
  duration?: number; // in minutes
}

export interface ActivityCard extends BaseCard {
  type: 'activity';
  location: string;
  time?: string;
  duration?: number; // in minutes
  category?: string;
}

export interface NoteCard extends BaseCard {
  type: 'note';
  content: string;
  color?: string;
}

export type TripCard = FlightCard | StayCard | FoodCard | ActivityCard | NoteCard;

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  cards: TripCard[];
  budget?: number;
}

export type ViewMode = 'board' | 'timeline';
