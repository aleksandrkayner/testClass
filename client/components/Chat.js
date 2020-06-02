import React, {Component} from 'react'
import socketIOClient from 'socket.io-client'
var socket = socketIOClient('http://127.0.0.1:8080')
var qs = require('qs')
import queryString from 'query-string'
import {connect} from 'react-redux'

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }
    this.a = this.a.bind(this)
  }
  a() {
    let userName = queryString.parse(this.props.location.search).userName
    let room = queryString.parse(this.props.location.search).room
    console.log(userName, room)
    socket.on('chat-message', function(msg) {
      console.log(msg)
      let li = document.createElement('li')
      li.innerHTML = `${msg.userName} ${msg.message} ${msg.time}`
      let mes = document.getElementById('message')
      //mes.innerHTML = `${mes.innerHTML}<li>${msg}</li>`
      mes.appendChild(li)
      this.setState({message: ''})
    })
  }

  render() {
    let userName = queryString.parse(this.props.location.search).userName
    let room = queryString.parse(this.props.location.search).room
    let uniq = []
    console.log(userName, room)
    socket.emit('joinRoom', {userName, room})
    socket.emit('getUsers', {userName, room})
    socket.on('getUsers', msg => {
      uniq = [...new Set(msg.map(user => user.userName))]
      uniq.map(user => {
        let li = document.createElement('li')
        li.innerHTML = user
        let list = document.getElementById('listUsers')
        list.appendChild(li)
      })
      console.log(msg, uniq)
    })
    return (
      <div>
        <h2>User Name:{userName}</h2>
        <h2>Room Name:{room}</h2>
        <form
          id="socket"
          onSubmit={e => {
            e.preventDefault()
            socket.emit('chat-message', {
              roomName: room,
              userName: userName,
              message: this.state.message
            })

            // this.a()
          }}
        >
          <input
            value={this.state.message}
            id="m"
            onChange={e => {
              this.setState({message: e.target.value})
            }}
          />
          <button
            onClick={e => {
              this.a()
              //this.setState({message: ''})
            }}
          >
            Send
          </button>
          <ul id="message" />
          <h2>List of Users in The Room</h2>
          <ul id="listUsers" />
        </form>
      </div>
    )
  }
}
const mapState = ({user}) => {
  return {
    user
  }
}
export default connect(mapState)(Chat)
