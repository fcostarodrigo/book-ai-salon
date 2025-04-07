import type { QueryResponse } from "@/model";

export const Output = ({ query }: { query: QueryResponse }) => {
  return (
    <>
      <p className="query">{query.query}</p>
      <p className="output">{query.query}</p>
    </>
  );
};
