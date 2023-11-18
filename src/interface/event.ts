import Player, { Direction } from '../class/Player';

export enum Events {
  Tick = 'tick',
  Connect = 'connect',
  Disconnect = 'disconnect',
  NewPlayer = 'new-player',
  Preload = 'preload',
  ChangeDirection = 'change-direction',
}

export interface TickPayload {
  players: Player[];
}

export interface PreloadPayload {
  players: Player[];
}

export type NewPlayerPayload = Player;

export type ChangeDirectionPayload = Direction;