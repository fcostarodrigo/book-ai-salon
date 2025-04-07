import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

export const MicButton = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [status, setStatus] = useState<"inactive" | "recording">("inactive");

  const handleClick = () => {
    if (mediaRecorder === undefined) {
      setStatus("recording");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);

          setMediaRecorder(newMediaRecorder);
          newMediaRecorder.addEventListener("dataavailable", () => {
            // TODO: Send to the server, get text, set text to the text input field.
            console.log("Recording");
          });
        })
        .catch(console.error);
    } else if (status === "inactive") {
      setStatus("recording");
      mediaRecorder.start();
    } else {
      setStatus("inactive");
      mediaRecorder.stop();
    }
  };

  const classes = ["shadow"];

  if (status === "recording") {
    classes.push("recording");
  }

  return (
    <button type="button" className={classes.join(" ")} onClick={handleClick}>
      <FaMicrophone />
    </button>
  );
};
