import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={`square ${
        props.winnerSquare ? 'winner-square' : ''
      }`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        winnerSquare={this.props?.winnerLine?.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    let squareIndex = 0;
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const cols = [];
      for (let col = 0; col < 3; col++) {
        cols.push(this.renderSquare(squareIndex));
        squareIndex++;
      }
      rows.push(
        <div key={squareIndex} className="board-row">
          {cols}
        </div>
      );
    }
    return <div>{rows}</div>;
  }

  render() {
    return this.renderBoard();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          square: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          square: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      orderDesc: false,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const position = returnPosition(step.square);
      const value = step.squares[step.square];
      const desc = move
        ? `Go to move #${move} - [${value}] in (col ${position.col}, row ${position.row})`
        : 'Go to game start';
      return (
        <li
          key={move}
          className={
            this.state.stepNumber === move ? 'selected-move' : ''
          }
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (this.state.orderDesc) {
      moves.reverse();
    }
    let status;
    if (winner) {
      status = 'Winner: ' + winner.value;
    } else {
      if (current.squares.includes(null)) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'Draw game';
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerLine={winner?.line}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              onClick={() => this.setState({ orderDesc: false })}
            >
              Asc
            </button>
            <button
              onClick={() => this.setState({ orderDesc: true })}
            >
              Desc
            </button>
          </div>
          <ol reversed={this.state.orderDesc}>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { value: squares[a], line: lines[i] };
    }
  }
  return null;
}

function returnPosition(i) {
  if (i === null) {
    return null;
  }

  const positions = [
    { col: 1, row: 1 },
    { col: 2, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 2 },
    { col: 2, row: 2 },
    { col: 3, row: 2 },
    { col: 1, row: 3 },
    { col: 2, row: 3 },
    { col: 3, row: 3 },
  ];
  return positions[i];
}
