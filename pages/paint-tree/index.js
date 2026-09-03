const app = document.getElementById('app');

const container = document.createElement('div');
container.id = 'container';

const canvas = document.createElement('canvas');
canvas.id = 'patternCanvas';

const cloud1 = document.createElement('div');
cloud1.id = 'cloud';

const cloud2 = document.createElement('div');
cloud2.id = 'cloud';

container.append(canvas, cloud1, cloud2);
app.append(container);

const ctx = canvas.getContext('2d');
let blossomIndex = 1;

const drawBlossom = (x, y, isOrange) => {
  ctx.save();

  if (isOrange) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e66e4a';
    ctx.fill();
    ctx.shadowColor = 'rgb(255, 102, 0)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'rgb(255, 255, 255)';
    ctx.shadowBlur = 2;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

const drawBranch = (depth, x, y, angle, length, width) => {
  if (length < 5) {
    const isOrange = blossomIndex % 50 === 0;
    blossomIndex += 1;
    drawBlossom(x, y, isOrange);
    return;
  }

  ctx.lineWidth = width;
  ctx.strokeStyle = '#412e1f';
  ctx.beginPath();
  ctx.moveTo(x, y);

  const nextX = x + Math.cos(angle) * length;
  const nextY = y + Math.sin(angle) * length;
  ctx.lineTo(nextX, nextY);
  ctx.stroke();

  const direction = Math.random() < 0.5 ? 1 : -1;
  const spread = Math.floor(Math.random() * 20) + 21;

  for (let i = 0; i < 3; i += 1) {
    if (i !== 0 && (depth >= 3 && (i & 1) === 0 || Math.random() * 100 < 39)) {
      continue;
    }

    const nextAngle = angle + direction * (Math.PI / (180 / spread)) * (i - 1);
    const nextLength = length * (0.6 + Math.random() * 0.2);
    drawBranch(depth + 1, nextX, nextY, nextAngle, nextLength, width * 0.8);
  }
};

const render = () => {
  const size = container.clientWidth;

  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);
  blossomIndex = 1;

  const x = size / 2;
  const y = size / 2 + 145;
  const angle = -Math.PI / 2;
  const length = Math.min(120, Math.min(size / 4, size / 5.5));

  drawBranch(1, x, y, angle, length, 7);
};

render();
window.addEventListener('resize', render);
