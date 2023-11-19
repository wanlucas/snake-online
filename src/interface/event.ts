import Fruit from '../class/Fruit';
import Player, { Direction } from '../class/Player';

export enum Events {
  Tick = 'tick',
  Connect = 'connect',
  Disconnect = 'disconnect',
  NewPlayer = 'new-player',
  RemovePlayer = 'remove-player',
  PlayerMove = 'player-move',
  NewFruit = 'new-fruit',
  RemoveFruit = 'remove-fruit',
  GetFruit = 'get-fruit',
  Preload = 'preload',
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
