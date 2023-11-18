import ClientGame from './class/ClientGame';
import config from '../config';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = config.width;
canvas.height = config.height;
canvas.style.display = 'block';

const game = new ClientGame(context, {
	width: config.width,
	height: config.height,
});

window.addEventListener('keydown', (event: KeyboardEvent) => {
	game.onInput(event.key, true);
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
	game.onInput(event.key, false);
});