import { ADD_RECORD_EVENT } from "../actions/videoEditorActions";

const initialState = {
  isCropping: false,
  recordedEvents: [],
  // other initial state properties
};

const videoEditorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_IS_CROPPING":
      return {
        ...state,
        isCropping: action.payload,
      };
    case ADD_RECORD_EVENT:
      return {
        ...state,
        recordedEvents: [...state.recordedEvents, action.payload],
      };
    default:
      return state;
  }
};

export default videoEditorReducer;
