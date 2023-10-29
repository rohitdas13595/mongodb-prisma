"use client";
import { useQuery } from "react-query";
import { api } from "../providers/api.config";

export default function Example() {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch(`${api}/user`).then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: ";
  if (data) console.log("data", data.result);

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.result?.name}</strong>{" "}
    </div>
  );
}
