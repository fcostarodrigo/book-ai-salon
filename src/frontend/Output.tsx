import Markdown from "react-markdown";
import type { promptResponse } from "@/model";

export const Output = ({ prompt }: { prompt: promptResponse }) => {
  return (
    <>
      <p className="query">{prompt.query}</p>
      <p className="output">
        <Markdown>{prompt.response}</Markdown>
      </p>
    </>
  );
};
