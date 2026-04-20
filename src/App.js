import { useState } from 'react';

// a "component" is just a function that returns JSX (HTML-like syntax)
// props are the inputs passed in from the parent — like function arguments
function Square({ value, onSquareClick }) {
  return <button className="square" data-value={value || ''} onClick={onSquareClick}>
    {value}  
  </button>;
}

// board receives 3 props: whose turn it is, the current cell values, and a callback to report moves
function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X'; 
    } else {
      nextSquares[i] = 'O'; 
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner; 
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O'); 
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );

}

// Game is the top-level component — owns all state and passes it down to children
export default function Game() {
  // state: every board snapshot ever, starting with one empty board (nulls)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // state: which snapshot we're currently viewing
  const [currentMove, setCurrentMove] = useState(0);

  // derived from state — no need to store these as separate state variables
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // called by Board after a valid move — appends snapshot and advances the pointer
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // called when user clicks a history button — rewinds the board without deleting history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // build one button per move so the user can jump to any point in the game
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game-wrapper">
      <h1 className="game-title">Tic&#8209;Tac&#8209;Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <p className="history-label">Move History</p>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );

}

// pure JS function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]  
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null; 
}
