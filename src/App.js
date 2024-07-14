import React from "react";
import VideoEditor from "./VideoEditor/VideoEditor";
import Header from "./Header/Header";
import "./App.css"
import Footer from "./Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <VideoEditor />
      <Footer />
    </div>
  );
}

export default App;
