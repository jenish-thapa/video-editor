import Button from "../../utils/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { setIsCropping } from "../../actions/videoEditorActions";
import "./Footer.css";

const Footer = () => {
  const isCropping = useSelector((state) => state.videoEditor.isCropping);
  const records = useSelector((state) => state.videoEditor.recordedEvents);
  const dispatch = useDispatch();

  const falseCropping = () => {
    console.log(isCropping);
    dispatch(setIsCropping(false));
  };

  const trueCropping = () => {
    console.log(isCropping);
    dispatch(setIsCropping(true));
  };

  const exportJSON = () => {
    console.log("clicked");
    const jsonContent = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cropper_events.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer>
      <div className="footer-left">
        <Button
          text="Start Cropper"
          color="#7C36D6"
          isDisabled={isCropping}
          cb={trueCropping}
        />
        <Button
          text="Remove Cropper"
          color="#7C36D6"
          isDisabled={!isCropping}
          cb={falseCropping}
        />
        <Button
          text="Generate Preview"
          color="#7C36D6"
          isDisabled={false}
          cb={exportJSON}
        />
      </div>
      <div className="footer-right">
        <Button text="cancel" color="#45474E" isDisabled={false} />
      </div>
    </footer>
  );
};
export default Footer;
