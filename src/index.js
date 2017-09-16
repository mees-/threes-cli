import Threes from 'threes'
import { h, Component, Text, render } from 'ink'
import keypress from 'keypress'
import clone from 'clone'
import debounce from 'debounce-fn'

// enable keypress events on stdin
keypress(process.stdin)

class App extends Component {
  constructor() {
    super()
    this.game = new Threes()
    this.state = clone(this.game.board)

    this.handleKeyPress = debounce(
      (_, key) => {
        if (['up', 'down', 'left', 'right'].includes(key.name)) {
          this.game.move(key.name.toUpperCase())
          this.setState(clone(this.game.board))
        }
      },
      { wait: 10 },
    ).bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  }

  componentDidMount() {
    process.stdin.on('keypress', this.handleKeyPress)
  }

  componentWillUnmount() {
    process.stdin.removeListener('keypress', this.handleKeyPress)
  }

  render() {
    const highestNum = Math.max(
      Math.max(...this.state[0]),
      Math.max(...this.state[1]),
      Math.max(...this.state[2]),
      Math.max(...this.state[3]),
    )
    return this.game.ended ? (
      <Text>You ded, score: {this.game.score()}</Text>
    ) : (
      <GameGrid board={this.state} tileWidth={highestNum.toString().length} />
    )
  }
}

const Tile = ({ tileWidth, children }) => {
  let str = `-${children[0].toString().padStart(tileWidth, '0')}-`

  if (children[0] === '0') {
    return <Text bgKeyword='white' keyword='black'>{str}</Text>
  }

  if (children[0] === '1') {
    return <Text bgKeyword='red'>{str}</Text>
  }

  if (children[0] === '2') {
    return <Text bgKeyword='blue'>{str}</Text>
  }

  if (children[0] === '3') {
    return <Text bgKeyword='orange'>{str}</Text>
  }

  return <Text>{str}</Text>
}

const GameGrid = ({ board, tileWidth }) => {
  return (
    <div>
      <Tile tileWidth={tileWidth}>{board[0][0]}</Tile>
      <Tile tileWidth={tileWidth}>{board[0][1]}</Tile>
      <Tile tileWidth={tileWidth}>{board[0][2]}</Tile>
      <Tile tileWidth={tileWidth}>{board[0][3]}</Tile>
      <br />
      <Tile tileWidth={tileWidth}>{board[1][0]}</Tile>
      <Tile tileWidth={tileWidth}>{board[1][1]}</Tile>
      <Tile tileWidth={tileWidth}>{board[1][2]}</Tile>
      <Tile tileWidth={tileWidth}>{board[1][3]}</Tile>
      <br />
      <Tile tileWidth={tileWidth}>{board[2][0]}</Tile>
      <Tile tileWidth={tileWidth}>{board[2][1]}</Tile>
      <Tile tileWidth={tileWidth}>{board[2][2]}</Tile>
      <Tile tileWidth={tileWidth}>{board[2][3]}</Tile>
      <br />
      <Tile tileWidth={tileWidth}>{board[3][0]}</Tile>
      <Tile tileWidth={tileWidth}>{board[3][1]}</Tile>
      <Tile tileWidth={tileWidth}>{board[3][2]}</Tile>
      <Tile tileWidth={tileWidth}>{board[3][3]}</Tile>
    </div>
  )
}

const unmount = render(<App />)
