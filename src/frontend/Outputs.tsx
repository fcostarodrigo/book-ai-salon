import { useAtom } from "jotai";
import { promptsAtom } from "./atoms";
import { Output } from "./Output";

export const Outputs = () => {
  const [prompts] = useAtom(promptsAtom);

  return (
    <div className="outputArea">
      {prompts.map((prompt) => (
        <Output key={prompt.promptId} prompt={prompt}></Output>
      ))}
    </div>
  );
};
