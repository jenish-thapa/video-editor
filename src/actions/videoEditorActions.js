export const setIsCropping = (isCropping) => ({
  type: "SET_IS_CROPPING",
  payload: isCropping,
});

export const ADD_RECORD_EVENT = "ADD_RECORD_EVENT";

export const addRecordEvent = (event) => ({
  type: ADD_RECORD_EVENT,
  payload: event,
});