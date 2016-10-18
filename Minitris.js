var blockSize = 60;
var blockColors = ["red", "green", "blue", "yellow", "black", "white"];
var activeBlock = {
   x: 2,
   y: -1,
   color: ""
}
var gameGrid = [[],[],[],[],[]];
var gameSpeed = 400;
var keyReady = true;
var canvas;
var ctx;
var dropActive;
var gameActive;

function startGame() {
   canvas = document.getElementById('minitris');
   ctx = canvas.getContext('2d');
   canvas.width = 300;
   canvas.height = 480;
   ctx.fillStyle   = '#111';
   ctx.fillRect(0,0,canvas.width,canvas.height);
   gameGrid = [[],[],[],[],[]];
   activeBlock.x = 2;
   activeBlock.y = -1;
   activeBlock.color = blockColors[Math.floor(Math.random() * 6)];
   gameActive = true;
   dropActive = setInterval(moveBlock,gameSpeed);
}
function eraseBlock(x, y) {
   ctx.fillStyle = '#111';
   ctx.fillRect((x)*blockSize,(y)*blockSize,blockSize,blockSize);
}
function drawBlock(x, y, color) {
   ctx.fillStyle = '#999';
   ctx.fillRect((x)*blockSize,(y)*blockSize,blockSize,blockSize);
   ctx.fillStyle = color;
   ctx.fillRect((x)*blockSize+4,(y)*blockSize+4,blockSize-8,blockSize-8);
}
function dropBlocks(x, y) {
   if (gameGrid[x][y-1] && !gameGrid[x][y]) {
      eraseBlock(x, y-1);
      gameGrid[x][y] = gameGrid[x][y-1];
      drawBlock(x, y, gameGrid[x][y]);
      gameGrid[x][y-1] = undefined;
      
   }
   if (y > 0)
      dropBlocks(x, y-1);
}
function matchBlocks(matchingBlocks, x, y, x2, y2, first) {
   if ((x+x2 < 5 && x+x2 >= 0) && (y+y2 < 8 && y+y2 >= 0)) {
      if (gameGrid[x+x2][y+y2] == gameGrid[x][y]) {
         matchingBlocks.push([x+x2, y+y2]);
         if (first == true) {
            matchingBlocks = matchBlocks(matchingBlocks, x, y, x2*2, y2*2, false);
         }
      }
   }
   return matchingBlocks;
}
function checkBlockLine(matchingBlocks, blockLine) {
   if(matchingBlocks) {
      if (matchingBlocks.length >= 2) {
         for (var location of matchingBlocks) {
            blockLine.push(location);
         }
      }
   }
   return blockLine;
}
function checkBlocks(x, y) {
   var matchingBlocks = [];
   var blockLine = [[x, y]];
   var blockColor = gameGrid[x][y];
   //check up-left
   matchingBlocks = matchBlocks(matchingBlocks, x, y, -1, -1, true);
   //check down-right
   matchingBlocks = matchBlocks(matchingBlocks, x, y, +1, +1, true);
   blockLine = checkBlockLine(matchingBlocks, blockLine);
   matchingBlocks = [];
   //check left
   matchingBlocks = matchBlocks(matchingBlocks, x, y, -1, 0, true);
   //check right
   matchingBlocks = matchBlocks(matchingBlocks, x, y, +1, 0, true);
   blockLine = checkBlockLine(matchingBlocks, blockLine);
   matchingBlocks = [];
   //check down-left
   matchingBlocks = matchBlocks(matchingBlocks, x, y, -1, +1, true);
   //check up-right
   matchingBlocks = matchBlocks(matchingBlocks, x, y, +1, -1, true);
   blockLine = checkBlockLine(matchingBlocks, blockLine);
   matchingBlocks = [];
   //check up
   matchingBlocks = matchBlocks(matchingBlocks, x, y, 0, -1, true);
   //check down
   matchingBlocks = matchBlocks(matchingBlocks, x, y, 0, +1, true);
   blockLine = checkBlockLine(matchingBlocks, blockLine);
   //Remove the matching blocks if 3 or more
   if (blockLine.length >= 3) {
      for (var i = 0; i < blockLine.length; i++) {
         eraseBlock(blockLine[i][0], blockLine[i][1]);
         gameGrid[blockLine[i][0]][blockLine[i][1]] = undefined;
      }
      for (var i = 0; i < blockLine.length; i++) {
         //dropBlocks(blockLine[i][0], blockLine[i][1]);
         dropBlocks(blockLine[i][0], 7);
      }
      for (var i = 1; i < blockLine.length; i++) {
         if (gameGrid[blockLine[i][0]][blockLine[i][1]]) {
            setTimeout(checkBlocks, 300, blockLine[i][0], blockLine[i][1]);
            //checkBlocks(blockLine[i][0], blockLine[i][1]);
         }
      }
   }
}
function endGame() {
   clearInterval(dropActive);
   gameActive = false;
   ctx.fillStyle = "#000";
   ctx.lineWidth="6";
   ctx.rect(30,160,240,160);
   ctx.stroke(); 
   ctx.fillStyle = '#fff';
   ctx.fillRect(30,160,240,160);
   ctx.textAlign = "center";
   ctx.fillStyle = "black";
   ctx.font = "38px Courier";
   ctx.fillText("Game Over", canvas.width/2, canvas.height/2-10); 
   ctx.font = "12px Courier";
   ctx.fillText("Hit enter to start a new game.", canvas.width/2, canvas.height/2+30); 
}
function moveDown() {
   if ((activeBlock.y < 7) && !gameGrid[activeBlock.x][activeBlock.y+1]) {
      if (activeBlock.y == -1) keyReady = true;
      else eraseBlock(activeBlock.x, activeBlock.y);
      drawBlock(activeBlock.x, activeBlock.y+1, activeBlock.color);
      activeBlock.y++;
      return true;
   }
   else return false;
}
function moveBlock() {
   if (!moveDown()) {
      keyReady = false;
      if (activeBlock.y == -1) {
         endGame();
      } else {
         gameGrid[activeBlock.x][activeBlock.y] = activeBlock.color;
         checkBlocks(activeBlock.x, activeBlock.y);
         activeBlock.x = 2;
         activeBlock.y = -1;
         activeBlock.color = blockColors[Math.floor(Math.random() * 6)];
      }
   }
}
function moveLeft() {
   if (activeBlock.x > 0) {
      if (!gameGrid[activeBlock.x-1][activeBlock.y]) {
         eraseBlock(activeBlock.x, activeBlock.y);
         drawBlock(activeBlock.x-1, activeBlock.y, activeBlock.color);
         activeBlock.x--;
      }
   }
}
function moveRight() {
   if (activeBlock.x < 4) {
      if (!gameGrid[activeBlock.x+1][activeBlock.y]) {
         eraseBlock(activeBlock.x, activeBlock.y);
         drawBlock(activeBlock.x+1, activeBlock.y, activeBlock.color);
         activeBlock.x++;
      }
   }
}
$(document).ready(function() {
   $(document).keydown(function(event) {
      if (keyReady) {
         switch(event.keyCode) {
            case 37: moveLeft();
              break;
            case 39: moveRight();
              break;
            case 40: moveDown();
              break;
         }
      } else if (!gameActive) {
         if (event.keyCode == 13) {
            startGame();
         }
      }
      
   });
});