import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="head-left">Cropper</div>
      <div className="head-right">
        <div className="btn-group">
          <button id="pre-btn">Preview Session</button>
          <button id="gen-btn">Generate Session</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
