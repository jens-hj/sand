let height = 500;
let width = 500;

let w = 5;
let cols = Math.floor(width / w);
let rows = Math.floor(height / w)
let grid = make_grid(cols, rows, 0);
let hue = 1;

let brush_size = 5;

function make_grid(cols, rows, defaultVal) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(defaultVal);
  }
  return arr;
}

function drawCell(row, col, state) {
  let x = col * w;
  let y = row * w;
  // use state as hue
  let color = `hsl(${state}, 75%, 75%)`;
  fill(color);
  rect(x, y, w, w);
}

function draw_cells() {
  // draw grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let state = grid[row][col];
      // draw cell
      if (state > 0) {
        drawCell(row, col, state);
      }
    }
  }
}

function step_cells() {
  // step cells
  let next = make_grid(grid.length, grid[0].length, 0);

  // instead go from bottom up
  for (let row = grid.length - 1; row >= 0; row--) {
    for (let col = 0; col < grid[0].length; col++) {
        
      let state = grid[row][col];

      if (state == 0) {
        continue;
      }

      if (row < grid.length - 1) {
        let state_below = grid[row + 1][col];
        if (state_below == 0) {
          grid[row + 1][col] = state;
          grid[row][col] = 0;
        } else {
          // check cell below to the right
          let state_below_right = -1;
          let state_below_left = -1;
          let available = [];
          
          if (col < grid[0].length - 1) {
            state_below_right = grid[row + 1][col + 1];
            if (state_below_right == 0) {
              available.push([row + 1, col + 1]);
            }
          }
          if (col > 0) {
            state_below_left = grid[row + 1][col - 1];
            if (state_below_left == 0) {
              available.push([row + 1, col - 1]);
            }
          }

          // choose a random available cell
          if (available.length > 0) {
            let rand = Math.floor(Math.random() * available.length);
            let [r, c] = available[rand];
            grid[r][c] = state;
            grid[row][col] = 0;
          }
        }
      }
    }
  }
}

function handle_mouse_drag() {
  if (mouseIsPressed) {
    let row = Math.floor(mouseY / w);
    let col = Math.floor(mouseX / w);

    if (row > grid.length -1 || col > grid[0].length -1 || row < 0 || col < 0) {
      return;
    }

    // use brush size as radius
    let radius = Math.floor(brush_size / 2);
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        let r = row + i;
        let c = col + j;

        let distance = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));

        if (r < grid.length &&
            c < grid[0].length &&
            r >= 0 && c >= 0 &&
            distance <= radius &&
            grid[r][c] == 0) {
          grid[r][c] = hue;
        }
      }
    }

    if (Math.random() < 0.5) {
      hue += 1;
    }

    if (hue > 360) {
      hue = 1;
    }
  }
}

function setup() {
  createCanvas(width, height);
  noStroke();
}

function draw() {
  // background('#eff1f5');
  background('#303446');
  handle_mouse_drag();
  step_cells();
  draw_cells();
}
