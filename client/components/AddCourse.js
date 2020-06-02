import React, {Component} from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
var socket = socketIOClient('http://127.0.0.1:8080')
var qs = require('qs')

class AddCourse extends Component {
  constructor() {
    super()
    this.state = {
      roomName: 'JavaScript',
      userName: ''
    }
    this.a = this.a.bind(this)
  }

  a() {
    socket.on('message', function(msg) {
      console.log(msg)
      let li = document.createElement('li')
      li.innerHTML = `${msg}`
      let mes = document.getElementById('message')
      //mes.innerHTML = `${mes.innerHTML}<li>${msg}</li>`
      mes.appendChild(li)
      this.setState({message: ''})
    })
  }
  render() {
    const {user} = this.props
    console.log('useruser', user)
    const {username, room} = qs.parse(location.search, {
      ignoreQueryPrefix: true
    })
    var el
    return (
      <div>
        <div>
          <header className="join-header">
            <h1>ChatCord</h1>
          </header>

          <form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username..."
                required
                onChange={e => {
                  this.setState({userName: e.target.value})
                }}
              />
            </div>
            <div>
              <label htmlFor="room">Room</label>
              <select
                name="room"
                id="room"
                onChange={e => {
                  this.setState({roomName: e.target.value})
                  console.log(this.state.roomName)
                }}
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="PHP">PHP</option>
                <option value="C#">C#</option>
                <option value="Ruby">Ruby</option>
                <option value="Java">Java</option>
              </select>
            </div>
            <Link
              to={`/chat?userName=${this.state.userName}&room=${
                this.state.roomName
              }`}
            >
              Join Chat
              {/* <button
              // onClick={() => {
              //   this.props.history.push(
              //     `/chat?userName=${this.state.userName}&room=${this.state.roomName}`
              //   )
              // }}
              >
                Join Chat
              </button> */}
            </Link>
          </form>
        </div>
        <ul id="message" />
        {/* <form
          id="socket"
          onSubmit={e => {
            e.preventDefault()
            socket.emit('chat message', this.state.message)

            // this.a()
          }}
        >
          <input
            id="m"
            onChange={e => {
              this.setState({message: e.target.value})
            }}
          />
          <button
            onClick={e => {
              this.a()
            }}
          >
            Send
          </button>
          <button>hello</button>
        </form> */}
      </div>
    )
  }
}
const mapState = ({user}) => {
  return {
    user
  }
}
export default connect(mapState)(AddCourse)
