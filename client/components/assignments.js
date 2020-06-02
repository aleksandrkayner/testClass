import React, {Component} from 'react'
import {connect} from 'react-redux'
import {readAssignments} from '../store/assignment'

class Assignments extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.load()
  }

  render() {
    if (!this.props.assignment) {
      return null
    }
    return (
      <ul>
        {this.props.assignment.map(assignment => (
          <li key={assignment.id}>{assignment.name}</li>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = ({assignment}) => {
  if (!assignment) {
    return {}
  }
  return {
    assignment
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => {
      dispatch(readAssignments())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Assignments)
