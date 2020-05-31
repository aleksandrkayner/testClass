import axios from 'axios'

//ACTION TYPES
export const CREATE_ASSIGNMENT = 'CREATE_ASSIGNMENT'
export const READ_ASSIGNMENT = 'READ_ASSIGNMENT'
export const UPDATE_ASSIGNMENT = 'UPDATE_ASSIGNMENT'
export const DELETE_ASSIGNMENT = 'DELETE_ASSIGNMENT'
export const READ_ASSIGNMENTS = 'READ_ASSIGNMENTS'

//ACTION CREATORS
const _createAssignment = assignment => {
  return {
    type: CREATE_ASSIGNMENT,
    assignment
  }
}
const _readAssignment = assignment => {
  return {
    type: READ_ASSIGNMENT,
    assignment
  }
}
const _updateAssignment = assignment => {
  return {
    type: UPDATE_ASSIGNMENT,
    assignment
  }
}

const _deleteAssignment = assignment => {
  return {
    type: DELETE_ASSIGNMENT,
    assignment
  }
}

const _readAssignments = assignments => {
  return {
    type: READ_ASSIGNMENTS,
    assignments
  }
}

//THUNK CREATORS
const createAssignment = assignment => {
  return async dispatch => {
    const createdAssignment = (await axios.post('/api/assignments', assignment))
      .data
    dispatch(_createAssignment(createdAssignment))
  }
}

const updateAssignment = assignment => {
  return async dispatch => {
    const updatedAssignment = (await axios.put(
      `/api/assignment/${assignment.id}`,
      assignment
    )).data
    dispatch(_updateAssignment(updatedAssignment))
  }
}

const readAssignment = id => {
  return async dispatch => {
    const _assignment = (await axios.get(`/api/assignments/${id}`)).data
    dispatch(_readAssignment(_assignment))
  }
}

const deleteAssignment = assignment => {
  return async dispatch => {
    await axios.delete(`/api/assignments/${assignment.id}`)
    dispatch(_deleteAssignment(assignment))
  }
}

export const readAssignments = () => {
  return async dispatch => {
    const assignments = (await axios.get('/api/assignments')).data
    dispatch(_readAssignments(assignments))
  }
}

//REDUCER
export default function(state = [], action) {
  switch (action.type) {
    case CREATE_ASSIGNMENT:
      return [...state, action.assignment]
    case READ_ASSIGNMENT:
      return action.assignment
    case READ_ASSIGNMENTS:
      return action.assignments
    case UPDATE_ASSIGNMENT:
      return state.map(
        assignment =>
          assignment.id === action.assignment.id
            ? action.assignment
            : assignment
      )
    case DELETE_ASSIGNMENT:
      return state.filter(assignment => assignment.id !== action.assignment.id)
    default:
      return state
  }
}
