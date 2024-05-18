const { createCanvas } = require("@napi-rs/canvas");

export async function createGenArt(num) {
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Define a set of color stops
  const antiqueColors = [
    { start: "rgba(233, 214, 107, 0.3)", end: "rgba(233, 214, 107, 0.4)" },
    { start: "rgba(207, 190, 149, 0.25)", end: "rgba(207, 190, 149, 0.4)" },
    { start: "rgba(188, 152, 126, 0.35)", end: "rgba(188, 152, 126, 0.4)" },
    { start: "rgba(163, 134, 113, 0.3)", end: "rgba(163, 134, 113, 0.4)" },
    { start: "rgba(216, 200, 157, 0.25)", end: "rgba(216, 200, 157, 0.4)" },
    { start: "rgba(192, 174, 138, 0.3)", end: "rgba(192, 174, 138, 0.4)" },
    { start: "rgba(175, 148, 131, 0.35)", end: "rgba(175, 148, 131, 0.4)" },
    { start: "rgba(222, 207, 182, 0.25)", end: "rgba(222, 207, 182, 0.4)" },
    { start: "rgba(197, 179, 153, 0.3)", end: "rgba(197, 179, 153, 0.4)" },
    { start: "rgba(214, 196, 166, 0.35)", end: "rgba(214, 196, 166, 0.4)" },
    { start: "rgba(234, 224, 200, 0.25)", end: "rgba(234, 224, 200, 0.4)" },
    { start: "rgba(210, 180, 140, 0.3)", end: "rgba(210, 180, 140, 0.4)" },
    { start: "rgba(188, 168, 144, 0.35)", end: "rgba(188, 168, 144, 0.4)" },
    { start: "rgba(168, 154, 130, 0.25)", end: "rgba(168, 154, 130, 0.4)" },
    { start: "rgba(184, 159, 128, 0.3)", end: "rgba(184, 159, 128, 0.4)" },
  ];

  const randomColorPair =
    antiqueColors[Math.floor(Math.random() * antiqueColors.length)];
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, randomColorPair.start);
  gradient.addColorStop(1, randomColorPair.end);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Drawing lines with variable thickness
  for (let i = 0; i < num / 100; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 80%, 80%, 0.4)`;
    ctx.lineWidth = Math.random() * 10 + 1;
    ctx.stroke();
  }

  // Adding bezier curves for more dynamic shapes
  for (let i = 0; i < num / 100; i++) {
    const cp1x = Math.random() * width;
    const cp1y = Math.random() * height;
    const cp2x = Math.random() * width;
    const cp2y = Math.random() * height;
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 70%, 0.8)`;
    ctx.lineWidth = Math.random() * 5 + 1;
    ctx.stroke();
  }

  // Drawing circles
  for (let j = 0; j < 4; j++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 50 + 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = `hsla(${Math.random() * 360}, 60%, 100%, 0.35)`;
    ctx.fill();
  }

  // Drawing a thick white border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 20;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const buffer = canvas.toBuffer("image/png");
  const base64Image = buffer.toString("base64");
  return base64Image;
}

export async function createGenArtFidLow(num) {
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#8A63D2";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < num / 50; i++) {
    const x = Math.random() * (width - 100);
    const y = Math.random() * (height - 100);
    const depth = Math.random() * 50 + 10;
    const blockWidth = Math.random() * 100 + 20;
    const blockHeight = Math.random() * 100 + 20;

    ctx.fillStyle = `hsl(${Math.random() * num}, 100%, 70%)`;
    ctx.fillRect(x, y, blockWidth, blockHeight);

    ctx.fillStyle = `hsl(${Math.random() * num}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + depth, y - depth);
    ctx.lineTo(x + depth + blockWidth, y - depth);
    ctx.lineTo(x + blockWidth, y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + blockWidth, y);
    ctx.lineTo(x + depth + blockWidth, y - depth);
    ctx.lineTo(x + depth + blockWidth, y - depth + blockHeight);
    ctx.lineTo(x + blockWidth, y + blockHeight);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 20;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const buffer = canvas.toBuffer("image/png");
  const base64Image = buffer.toString("base64");
  return base64Image;
}
