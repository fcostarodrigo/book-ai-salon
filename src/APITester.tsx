import { type FormEvent, useRef } from "react";

export const APITester = () => {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { current } = responseInputRef;

    if (current === null) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const endpoint = formData.get("endpoint") as string;
    const body = formData.get("body") as string;
    const url = new URL(endpoint, window.location.href);
    const method = formData.get("method") as string;

    fetch(url, { method, body: body || undefined })
      .then((res) => res.json())
      .then((data) => {
        current.value = JSON.stringify(data, null, 2);
      })
      .catch((error) => {
        current.value = String(error);
      });
  };

  return (
    <div className="api-tester">
      <form className="endpoint-row" onSubmit={testEndpoint}>
        <select name="method" className="method">
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
          <option value="POST">POST</option>
        </select>
        <input type="text" name="endpoint" defaultValue="/api/hello" className="url-input" placeholder="/api/hello" />
        <button type="submit" className="send-button">
          Send
        </button>
        <textarea name="body" className="body-input" placeholder="Body" />
      </form>
      <textarea readOnly ref={responseInputRef} placeholder="Response will appear here..." className="response-area" />
    </div>
  );
};
