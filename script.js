// Define constant for the total number of fruits
const FRUIT_COUNT = 20;

// Select the HTML elements that will be used to display the score and manipulate the canvas
const scoreContainer = document.getElementById("score-container");
const canvas = document.getElementById("canvas");

// Set the canvas dimensions to the full window width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the drawing context for the canvas (2D in this case)
const ctx = canvas.getContext("2d");

// Select the start button, cover screen, and result display elements
const startButton = document.getElementById("start-button");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const overText = document.getElementById("over-text");

// Set the base path for fruit images and initialize an empty fruits array and points counter
const base = "./images/";
let fruits = [];
let points = 0;

// Define a list of available fruit types
const fruitsList = ["apple", "banana", "grapes"];


// Define an object to store different event types for mouse and touch interactions
let events = {
  mouse: {
    down: "mousedown",  // Event for mouse button press
  },
  touch: {
    down: "touchdtart", // Event for touch start (typo in event name, should be "touchstart")
  },
};

// Variable to store the type of device being used (mouse or touch)
let deviceType = "";

// Declare variables for controlling the interval and random fruit creation time
let interval, randomCreationTime;

// Function to detect if the device supports touch events
const isTouchDevice = () => {
  try {
    // Try creating a TouchEvent to check if the device supports touch
    document.createEvent("TouchEvent");
    deviceType = "touch";  // If successful, set device type to "touch"
    return true;  // Return true indicating a touch device
  } catch (e) {
    deviceType = "mouse";  // If an error occurs, it's a mouse-based device
    return false;  // Return false indicating a non-touch device
  }
};

//Random number generator
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

//Fruit
function Fruit(image, x, y, width) {
  this.image = new Image();
  this.image.src = image;
  this.x = x;
  this.y = y;
  this.speed = generateRandomNumber(1, 5);
  this.width = width;
  this.clicked = false;
  this.complete = false;

  //Move fruit
  this.update = () => {
    this.y += this.speed;
    if (!this.complete && this.y + this.width > canvas.height) {
      this.complete = true;
    }
  };

  //Draw fruit
  this.draw = () => {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.width);
  };
  this.compare = (mouseX, mouseY) => {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.width
    );
  };
}

//Create a new fruit
function createRandomFruit() {
  //set random time for next fruit
  randomCreationTime = generateRandomNumber(3, 9);
  if (fruits.length < FRUIT_COUNT) {
    let randomFruit =
      fruitsList[generateRandomNumber(0, fruitsList.length - 1)];
    const randomImage = `${randomFruit}.png`;
    const randomX = generateRandomNumber(0, canvas.width - 50);
    const fruitWidth = generateRandomNumber(100, 200);
    let fruit = new Fruit(randomImage, randomX, 0, fruitWidth);
    fruits.push(fruit);
  }
  if (fruits.length == FRUIT_COUNT) {
    let checker = fruits.every((fruit) => {
      return fruit.complete == true;
    });
    if (checker) {
      clearInterval(interval);
      coverScreen.classList.remove("hide");
      canvas.classList.add("hide");
      overText.classList.remove("hide");
      result.innerText = `Final Score: ${points}`;
      startButton.innerText = "Restart Game";
      scoreContainer.classList.add("hide");
    }
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const fruit of fruits) {
    fruit.update();
    fruit.draw();
  }
  requestAnimationFrame(animate);
}
animate();
isTouchDevice();

canvas.addEventListener(events[deviceType].down, function (e) {
  let clickX =
    (isTouchDevice() ? e.touches[0].pageX : e.pageX) - canvas.offsetLeft;
  let clickY =
    (isTouchDevice() ? e.touches[0].pageY : e.pageY) - canvas.offsetTop;
  fruits.forEach(function (fruit) {
    let check = fruit.compare(clickX, clickY);
    if (check && !fruit.clicked) {
      fruit.clicked = true;
      points += 1;
      scoreContainer.innerHTML = points;
      fruit.complete = true;
      fruit.y = canvas.height;
    }
  });
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
});

startButton.addEventListener("click", () => {
  fruits = [];
  points = 0;
  scoreContainer.innerHTML = points;
  canvas.classList.remove("hide");
  coverScreen.classList.add("hide");
  createRandomFruit();
  randomCreationTime = generateRandomNumber(3, 9);
  interval = setInterval(createRandomFruit, randomCreationTime * 1000);
  scoreContainer.classList.remove("hide");
});
