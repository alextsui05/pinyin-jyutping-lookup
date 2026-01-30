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
  const [transliterations, setTransliterations] = useState<SnippetData[]>([
    sampleData,
  ]);

  return (
    <>
      <h1>Chinese Snippets</h1>
      {transliterations.map((snippet) => (
        <Snippet {...snippet} />
      ))}
    </>
  );
}

export default App;
