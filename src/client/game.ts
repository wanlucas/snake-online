import ClientGame from "./class/ClientGame";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const width = canvas.width;
const height = canvas.height;

const game = new ClientGame(context, {
  width,
  height,
});

console.log(game);