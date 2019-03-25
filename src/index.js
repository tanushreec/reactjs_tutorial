import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  let backgroundColor = (props.isWinner) ? 'green' : 'white';

      return (
        <button 
          className="square" 
          onClick={props.onClick}
          style={{backgroundColor}}
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(key, row, column, isWinner) {
      return (<Square key={key}
        value={this.props.squares[key]}
        isWinner={isWinner}
        onClick={() => this.props.onClick(key, row, column)}  
      />
      );
    }
  
    render() {     
      
      let squares = [];
      let key = 0;

      for(let i = 0; i < 3; i++)
      {
        let rows = [];

        for(let j = 0; j < 3; j++)
        {
          let isWinner = false;

          if(this.props.squares.winningSquares)
          {
            isWinner = this.props.squares.winningSquares.includes(key);
          }

          rows.push(this.renderSquare(key, i, j, isWinner));
          key++;
        }

        squares.push(<div key={i} className="board-row">{rows}</div>);
      }
      return (

        <div>
          {squares}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          row: null,
          column: null,
        }],
        xIsNext: true,
        stepNumber: 0,
        isAscending: true,
        toggleText: 'Sort Descending'
      }
    }

    toggleOrder()
    {
      let toggleText = (this.state.isAscending) ? 'Sort Ascending' : 'Sort Descending';

      this.setState({
        isAscending: !this.state.isAscending,
        toggleText,
      });
    }

    handleClick(i, row, column)
    {
      const history = this.state.history.slice(0, this.state.stepNumber + 1); //Throwing away future history if we move back
      const current = history[history.length - 1];
      const squares = current.squares.slice(); //Why slice? (creating a copy of the array) -Immutability
    
      if(calculateWinner(squares) || squares[i])
      {
        return;
      }

      squares[i] =  this.state.xIsNext ? 'X' : 'O';
    
      //concat() doesn't mutate original array.
      this.setState({history: history.concat([{
        squares: squares,
        row,
        column,
      }]), 
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
    }

    jumpTo(step)
    {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
        'Go to move #' + move + ' at ('
        + step.column + ', ' + step.row + ')' :
        'Go to game start';

        let fontWeight = (move === this.state.stepNumber) ? 'bold' : 'normal';

        let style = {fontWeight};

        return(
          <li key={move}>
            <button 
            style={style}
            onClick={() => this.jumpTo(move)}>
            {desc}
            </button>
          </li>
        );
      });

      if(!this.state.isAscending)
      {
        moves.sort((a, b) =>{
          return b.key - a.key;
        })
      }

      let status;
    
      if(winner){
        status = (winner[0] === 'draw') ? 'The game is a draw!' : 'Winner:' + winner[0];
        current.squares.winningSquares = winner[1];
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, row, col) => this.handleClick(i, row, col)} />
          </div>
          <div className="game-info">
            <div><em>Moves displayed in (col, row) format.</em></div>
            <div>{status}</div>
            <ol>{moves}</ol>
            <div>
              <button onClick={() => this.toggleOrder()}>
                {this.state.toggleText}
              </button>
              </div>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares)
  {
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

    for(let i = 0; i < lines.length; i++)
    {
      const [a, b, c] = lines[i];

      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      {
        return [squares[a], lines[i]];
      }
    }

    let areMovesOver = true;

    for(let i = 0; i < 9; i++)
    {
      if(!squares[i])
      {
        areMovesOver = false;
      }
    }

    return (areMovesOver) ? ['draw'] : null;
  }