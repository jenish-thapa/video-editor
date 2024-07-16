import { combineReducers } from "redux";
import videoEditorReducer from "./videoEditorReducer";

const rootReducer = combineReducers({
  videoEditor: videoEditorReducer,
  // Add other reducers as needed
});

export default rootReducer;
