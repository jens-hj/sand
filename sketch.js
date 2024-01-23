let height = 800;
let width = 800;

let w = 10;
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
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {

      let state = grid[row][col];

      if (state == 0) {
        continue;
      }

      if (row < grid.length - 1) {
        let state_below = grid[row + 1][col];
        if (state_below == 0) {
          next[row + 1][col] = state;
          next[row][col] = 0;
        } else {
          // check cell below to the right
          let state_below_right = -1;
          let state_below_left = -1;
          
          if (col < grid[0].length - 1) {
            state_below_right = grid[row + 1][col + 1];
          }
          if (col > 0) {
            state_below_left = grid[row + 1][col - 1];
          }

          if (state_below_right == 0 && state_below_left == 0) {
            let rand = Math.random();
            if (rand < 0.5) {
              next[row + 1][col + 1] = state;
            } else {
              next[row + 1][col - 1] = state;
            }
            next[row][col] = 0;
          } else if (state_below_right == 0) {
            next[row + 1][col + 1] = state;
            next[row][col] = 0;
          }
          else if (state_below_left == 0) {
            next[row + 1][col - 1] = state;
            next[row][col] = 0;
          } else {
            next[row][col] = state;
          }

        }
      } else {
        next[row][col] = state;
      }
    }
  }
  grid = next;
}

function handle_mouse_drag() {
  if (mouseIsPressed) {
    let row = Math.floor(mouseY / w);
    let col = Math.floor(mouseX / w);

    if (row > grid.length -1 || col > grid[0].length -1 || row < 0 || col < 0) {
      return;
    }

    for (let i = 0; i < brush_size; i++) {
      for (let j = 0; j < brush_size; j++) {
        let r = row + i;
        let c = col + j;
        if (r < grid.length && c < grid[0].length) {
          grid[r][c] = hue;
        }
      }
    }
    hue += 1;
    if (hue > 360) {
      hue = 1;
    }
  }
}

function setup() {
  createCanvas(width, height);
  noStroke();
}

// a custom 'sleep' or wait' function, that returns a Promise that resolves only after a timeout
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function draw() {
  background('#eff1f5');
  handle_mouse_drag();
  step_cells();
  draw_cells();
}
