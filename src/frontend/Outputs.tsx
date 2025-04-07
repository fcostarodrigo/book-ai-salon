import { useAtom } from "jotai";
import { queriesAtom } from "./atoms";
import { Output } from "./Output";

export const Outputs = () => {
  const [queries] = useAtom(queriesAtom);

  return (
    <div className="outputArea">
      {queries.map((output) => (
        <Output key={output.queryId} query={output}></Output>
      ))}
    </div>
  );
};
