import React, {Component} from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
var socket = socketIOClient('http://127.0.0.1:8080')

export default class AddCourse extends Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }
  }
  componentDidMount() {
    // let a = socket.on('time', function(data) {
    //   console.log(data, typeof data)
    //   this.setState({response: data})
    // })
    // console.log('aaaaaaa', a.io.connecting[0].connected)
    // a = a.io.connecting[0].connected
    // a = {response: a}
    // this.setState(a)
  }
  a() {
    socket.on('chat message', function(msg) {
      console.log(msg)
      let mes = document.getElementById('message')
      mes.innerHTML = `${mes.innerHTML}<li>${msg}</li>`
      console.log(mes)
    })
  }
  render() {
    var el
    return (
      <div>
        <ul id="message" />
        <form
          id="socket"
          onSubmit={e => {
            e.preventDefault()
            socket.emit('chat message', this.state.message)
            this.a()
          }}
        >
          <input
            id="m"
            onChange={e => {
              this.setState({message: e.target.value})
            }}
          />
          <button>Send</button>
          <button>hello</button>
        </form>
      </div>
    )
  }
}
