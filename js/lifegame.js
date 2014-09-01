'use strict';

function LifegameBoard(canvasId, cellSize, cellColor) {
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.ctx.fillStyle = cellColor;
  this.width = Math.floor(this.canvas.width / cellSize);
  this.height = Math.floor(this.canvas.height / cellSize);
  this.cellSize = cellSize;
  this.board = new Array(this.height * this.width);

  this.initBoard = function() {
    var board = this.board;
    for (var i = 1; i < this.height - 1; i++) {
      for (var j = 1; j < this.width - 1; j++) {
        board[i * this.width + j] = (Math.random() < 0.3 ? 1 : 0);
      }
    }
    for (var i = 0; i < this.height; i++) {
      board[i * this.width] = 0;
      board[i * this.width + (this.width - 1)] = 0;
    }
    var offset = (this.height - 1) * this.width;
    for (var i = 0; i < this.width; i++) {
      board[i] = 0;
      board[offset + i] = 0;
    }
  };
  this.initBoard();

  this.update = function() {
    var board = this.board.slice();
    for (var i = 1; i < this.height - 1; i++) {
      for (var j = 1; j < this.width - 1; j++) {
        var sum = this.countAliveCells(this.board, j, i);
        if (sum == 3) {
          board[i * this.width + j] = 1;
        } else if (sum != 2) {
          board[i * this.width + j] = 0;
        }
      }
    }
    this.board = board;
  };

  this.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var board = this.board;
    for (var i = 1; i < this.height - 1; i++) {
      for (var j = 1; j < this.width - 1; j++) {
        if (board[i * this.width + j] == 1) {
          this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  };

  this.countAliveCells = function(board, x, y) {
    var yOffset1 = (y - 1) * this.width;
    var yOffset2 = y * this.width;
    var yOffset3 = (y + 1) * this.width;
    return board[yOffset1 + x - 1] + board[yOffset1 + x] + board[yOffset1 + x + 1] +
      board[yOffset2 + x - 1] + board[yOffset2 + x + 1] +
      board[yOffset3 + x - 1] + board[yOffset3 + x] + board[yOffset3 + x + 1];
  };
}
