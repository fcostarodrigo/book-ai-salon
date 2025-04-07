import { useAtom } from "jotai";
import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { transcriptionResponse } from "@/model";
import { queryAtom, statusAtom } from "./atoms";

export const MicButton = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [, setQuery] = useAtom(queryAtom);
  const [, setStatus] = useAtom(statusAtom);

  const handleClick = () => {
    if (mediaRecorder === undefined) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];

          setMediaRecorder(newMediaRecorder);
          newMediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          });

          newMediaRecorder.addEventListener("stop", () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const formData = new FormData();

            formData.append("file", blob, "message.webm");

            setStatus("loading");
            fetch("/api/transcriptions", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((responseBody) => {
                const { transcription } = transcriptionResponse.parse(responseBody);

                setQuery(transcription);
                setStatus("loaded");
              })
              .catch(console.error);
          });

          newMediaRecorder.start();
        })
        .catch(console.error);
    } else {
      mediaRecorder.stop();
      setMediaRecorder(undefined);
    }
  };

  const classes = ["shadow"];

  if (mediaRecorder !== undefined) {
    classes.push("recording");
  }

  return (
    <button type="button" className={classes.join(" ")} onClick={handleClick}>
      <FaMicrophone />
    </button>
  );
};
