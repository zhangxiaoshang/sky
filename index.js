const STAR_COLOR = "#fff";
const LINE_COLOR = "#fff";
const EASING = 5;
let LINE_MAX_LEN;

const stars = [];
const lines = [];

function preload() {
  LINE_MAX_LEN = windowWidth / 8;
  initStars();
  initLines();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  drawStars();
  drawLines();
  moving();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawStars() {
  stars.forEach(star => {
    if (star.isFollowMouse) {
      return;
    }

    fill(STAR_COLOR);
    arc(star.x, star.y, star.radius, star.radius, 0, TWO_PI);
  });
}

function drawLines() {
  lines.forEach(l => {
    let length = calcLineLength(l);
    if (length > LINE_MAX_LEN) {
      return;
    }

    strokeWeight(1 - length / LINE_MAX_LEN);
    stroke(255, 255, 255, (1 - length / LINE_MAX_LEN) * 255);
    line(l.from.x, l.from.y, l.to.x, l.to.y);
  });
}

function moving() {
  stars.forEach(star => {
    star.x = star.x + star.vx;
    star.y = star.y + star.vy;

    // 越界检查
    if (star.x < 0 || star.x > windowWidth) {
      star.vx = star.vx * -1;
      star.x = clamp(0, windowWidth, star.x);
    }
    if (star.y < 0 || star.y > windowHeight) {
      star.vy = star.vy * -1;
      star.y = clamp(0, windowHeight, star.y);
    }
  });

  adjustStarFollowMouse();
}

function clamp(min, max, current) {
  if (current < min) {
    return min;
  }
  if (current > max) {
    return max;
  }
  return current;
}

function adjustStarFollowMouse() {
  stars[0].x += (mouseX - stars[0].x) / EASING;
  stars[0].y += (mouseY - stars[0].y) / EASING;
}

/**
 * 计算线长 公式 d^2 = x^2 + y^2
 *  */
function calcLineLength(l) {
  const dx = l.from.x - l.to.x;
  const dy = l.from.y - l.to.y;
  const dxPow2 = pow(dx, 2);
  const dyPow2 = pow(dy, 2);

  return sqrt(dxPow2 + dyPow2);
}

/* 准备星星 */
function initStars() {
  for (let i = 0; i < 100; i++) {
    let star = {
      isFollowMouse: i === 1,
      x: Math.random() * windowWidth,
      y: Math.random() * windowHeight,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      radius:
        Math.random() > 0.9 ? Math.random() * 3 + 3 : Math.random() * 3 + 1
    };

    stars.push(star);
  }
}

/* 准备连线 */
function initLines() {
  stars.forEach(s1 => {
    stars.forEach(s2 => {
      if (s1 === s2) {
        return;
      }

      let line = {
        from: s1,
        to: s2
      };

      addLine(line);
    });
  });
}

function addLine(line) {
  let ignore = false;

  lines.forEach(l => {
    if (l.form === line.to && l.to === line.form) {
      ignore = true;
    }
  });

  if (!ignore) {
    lines.push(line);
  }
}
