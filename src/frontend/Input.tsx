import { useAtom } from "jotai";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { promptResponseSchema } from "@/model";
import { promptsAtom } from "./atoms";
import { MicButton } from "./MicButton";

export const Input = () => {
  const [prompts, setPrompts] = useAtom(promptsAtom);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [status, setStatus] = useState<"loading" | "initial" | "loaded">("initial");
  const [query, setQuery] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setQuery("");
    setStatus("loading");
    fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({ query, conversationId }),
    })
      .then((response) => response.json())
      .then((promptResponse) => {
        const parsedPromptResponse = promptResponseSchema.parse(promptResponse);

        setConversationId(parsedPromptResponse.conversationId);
        setPrompts([...prompts, parsedPromptResponse]);
        setStatus("loaded");
      })
      .catch(console.error);
  };

  const inputAreaClasses = ["inputArea"];

  if (status !== "initial") {
    inputAreaClasses.push("sent");
  }

  const inputBoxClasses = ["inputBox"];

  if (status === "loading") {
    inputBoxClasses.push("loading");
  }

  return (
    <div className={inputAreaClasses.join(" ")}>
      <p>What time Ava Riley is available?</p>
      <p>Who is available on March first for a haircut?</p>
      <p>My name is Seraphina Dubois, can you register me?</p>

      <div className="inputBoxArea">
        <form className={inputBoxClasses.join(" ")} onSubmit={handleSubmit}>
          <input
            className="prompt"
            type="text"
            placeholder="Ask about bookings"
            value={query}
            disabled={status === "loading"}
            onChange={handleChange}
          />
          <MicButton />
          <button className="shadow" disabled={status === "loading"}>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};
