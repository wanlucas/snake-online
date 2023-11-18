import Fruit from '../class/Fruit';
import Player, { Direction } from '../class/Player';

export enum Events {
  Tick = 'tick',
  Connect = 'connect',
  Disconnect = 'disconnect',
  NewPlayer = 'new-player',
  NewFruit = 'new-fruit',
  RemoveFruit = 'remove-fruit',
  Preload = 'preload',
  ChangeDirection = 'change-direction',
}

export interface TickPayload {
  players: Player[];
}

export interface PreloadPayload {
  players: Player[];
  fruits: Fruit[];
}

export type NewFruitPayload = Fruit;

export type NewPlayerPayload = Player;

export type ChangeDirectionPayload = Direction;
