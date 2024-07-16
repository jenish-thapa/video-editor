import React from "react";
import "./App.css"
import Header from "./components/Header/Header";
import VideoEditor from "./components/VideoEditor/VideoEditor";
import Footer from "./components/Footer/Footer";
import { Provider } from "react-redux";
import store from "./store";


function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <Header />
      <VideoEditor />
      <Footer />
    </div>
    </Provider>
  );
}

export default App;
