import { useAtom } from "jotai";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { queryResponseSchema } from "@/model";
import { queriesAtom } from "./atoms";
import { MicButton } from "./MicButton";

export const Input = () => {
  const [queries, setQueries] = useAtom(queriesAtom);
  const [status, setStatus] = useState<"sent" | "initial">("initial");
  const [query, setQuery] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setQuery("");
    setStatus("sent");
    fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((queryResponse) => {
        queryResponseSchema.parse(queryResponse);
        setQueries([...queries, queryResponse]);
      })
      .catch(console.error);
  };

  const classes = ["inputArea"];

  if (status === "sent") {
    classes.push("sent");
  }

  return (
    <div className={classes.join(" ")}>
      <p>What time Ava Riley is available?</p>
      <p>Who is available on March first for a haircut?</p>
      <p>My name is Seraphina Dubois, can you register me?</p>

      <div className="inputBoxArea">
        <form className="inputBox" onSubmit={handleSubmit}>
          <input
            className="prompt"
            type="text"
            placeholder="Ask about bookings"
            value={query}
            onChange={handleChange}
          />
          <MicButton />
          <button className="shadow">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};
