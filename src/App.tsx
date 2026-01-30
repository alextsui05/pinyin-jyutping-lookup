import { useState } from "react";
import "./App.css";
import sampleData from "./assets/sample.json";

type SnippetData = {
  query: string;
  jyutping: string;
  pinyin: string;
};

function Snippet({ query, jyutping, pinyin }: SnippetData) {
  return (
    <div>
      <p className="text-8xl font-bold">{query}</p>
      <p>{jyutping}</p>
      <p>{pinyin}</p>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Chinese Snippets</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Snippet {...sampleData} />
    </>
  );
}

export default App;
