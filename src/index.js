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
    return this.game.ended ? <Text>You ded</Text> : <GameComponent grid={this.state} tileWidth={3} />
  }
}

const Tile = ({ tileWidth, children }) => {
  let str = ` ${children[0].toString().padStart(tileWidth, '0')} `

  return <Text>{str}</Text>
}

const GameComponent = ({ grid }) => {
  let highest = 0
  for (const row of Array.from(grid)) {
    for (const num of row) {
      if (highest < num) {
        highest = num
      }
    }
  }

  const tileWidth = highest.toString().length
  return <div>
    <Tile tileWidth={tileWidth}>{grid[0][0]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[0][1]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[0][2]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[0][3]}</Tile>
    <br />
    <Tile tileWidth={tileWidth}>{grid[1][0]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[1][1]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[1][2]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[1][3]}</Tile>
    <br />
    <Tile tileWidth={tileWidth}>{grid[2][0]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[2][1]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[2][2]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[2][3]}</Tile>
    <br />
    <Tile tileWidth={tileWidth}>{grid[3][0]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[3][1]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[3][2]}</Tile>
    <Tile tileWidth={tileWidth}>{grid[3][3]}</Tile>
  </div>
}

const unmount = render(<App />, process.stderr)
