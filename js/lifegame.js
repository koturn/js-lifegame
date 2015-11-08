;(function(global) {
  'use strict';

  function LifegameBoard(canvasId, cellSize, cellColor) {
    this._canvas = document.getElementById(canvasId);
    this._ctx = this._canvas.getContext('2d');
    this._ctx.fillStyle = cellColor;
    this._nCol = Math.floor(this._canvas.width / cellSize);
    this._nRow = Math.floor(this._canvas.height / cellSize);
    this._cellSize = cellSize;
    this._board = new Array(this._nRow * this._nCol);

    // Add mouse events
    (function(__this) {
      var isMouseDown = false;
      __this._canvas.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        mouseAction(e);
      });
      __this._canvas.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        e.target.style.cursor = 'default';
        mouseAction(e);
      });
      __this._canvas.addEventListener('mouseup', function(e) {
        isMouseDown = false;
      });

      function mouseAction(e) {
        var col = Math.floor(e.offsetX * __this._nCol / __this._canvas.width);
        var row = Math.floor(e.offsetY * __this._nRow / __this._canvas.height);
        if (!isInBoard(col, row)) return;
        switch (e.button) {
          case 0:
            drawBlock(col, row);
            break;
          case 2:
            clearBlock(col, row);
            break;
        }
      }

      function isInBoard(col, row) {
        return 1 <= col && col < __this._nCol - 1 && 1 <= row && row < __this._nRow - 1;
      }

      function drawBlock(col, row) {
        __this._board[row * __this._nCol + col] = 1;
        __this._ctx.fillRect(col * __this._cellSize, row * __this._cellSize, __this._cellSize, __this._cellSize);
      }

      function clearBlock(col, row) {
        __this._board[row * __this._nCol + col] = 0;
        __this._ctx.clearRect(col * __this._cellSize, row * __this._cellSize, __this._cellSize, __this._cellSize);
      }
    })(this);
  };

  LifegameBoard.prototype.initBoard = function(genRate) {
    genRate = genRate || 0.5;
    var board = this._board;
    for (var i = 1; i < this._nRow - 1; i++) {
      for (var j = 1; j < this._nCol - 1; j++) {
        board[i * this._nCol + j] = (Math.random() < genRate ? 1 : 0);
      }
    }
    for (var i = 0; i < this._nRow; i++) {
      board[i * this._nCol] = 0;
      board[i * this._nCol + (this._nCol - 1)] = 0;
    }
    var offset = (this._nRow - 1) * this._nCol;
    for (var i = 0; i < this._nCol; i++) {
      board[i] = 0;
      board[offset + i] = 0;
    }
  };

  LifegameBoard.prototype.update = function() {
    var board = this._board.slice();
    for (var i = 1; i < this._nRow - 1; i++) {
      for (var j = 1; j < this._nCol - 1; j++) {
        var sum = this.countAliveCells(this._board, j, i);
        if (sum == 3) {
          board[i * this._nCol + j] = 1;
        } else if (sum != 2) {
          board[i * this._nCol + j] = 0;
        }
      }
    }
    this._board = board;
  };

  LifegameBoard.prototype.draw = function() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    var board = this._board;
    for (var i = 1; i < this._nRow - 1; i++) {
      for (var j = 1; j < this._nCol - 1; j++) {
        if (board[i * this._nCol + j] == 1) {
          this._ctx.fillRect(j * this._cellSize, i * this._cellSize, this._cellSize, this._cellSize);
        }
      }
    }
  };

  LifegameBoard.prototype.countAliveCells = function(board, x, y) {
    var yOffset1 = (y - 1) * this._nCol;
    var yOffset2 = y * this._nCol;
    var yOffset3 = (y + 1) * this._nCol;
    return board[yOffset1 + x - 1] + board[yOffset1 + x] + board[yOffset1 + x + 1] +
      board[yOffset2 + x - 1] + board[yOffset2 + x + 1] +
      board[yOffset3 + x - 1] + board[yOffset3 + x] + board[yOffset3 + x + 1];
  };

  global.LifegameBoard = LifegameBoard;
})((this || 0).self || global);
