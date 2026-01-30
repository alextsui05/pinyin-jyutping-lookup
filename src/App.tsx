import { useState } from "react";
import "./App.css";
import sampleData from "./assets/sample.json";

type SnippetData = {
  query: string;
  jyutping: string;
  pinyin: string;
};

function Snippet({
  snippet,
  key,
  index,
}: {
  snippet: SnippetData;
  key: number;
  index: number;
}) {
  const { query, jyutping, pinyin } = snippet;
  let fontSize = "text-8xl";
  if (query.length > 10) {
    fontSize = "text-6xl";
  }
  let backgroundColor = "bg-gray-400";
  if (index % 2 === 1) {
    backgroundColor = "bg-gray-100";
  }
  console.log(index);
  return (
    <div key={key} className={`${backgroundColor} p-4 rounded-lg`}>
      <p className={`${fontSize} font-bold`}>{query}</p>
      <p>{jyutping}</p>
      <p>{pinyin}</p>
    </div>
  );
}

function App() {
  const [transliterations, setTransliterations] = useState<SnippetData[]>([
    sampleData,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://pinyin-api.atsui.click/transliteration?q=${encodeURIComponent(inputValue)}`,
      );
      const data: SnippetData = await response.json();
      setTransliterations([...transliterations, data]);
      setInputValue("");
    } catch (error) {
      console.error("Error fetching transliteration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Chinese Snippets</h1>
      {transliterations.map((snippet, idx) => (
        <Snippet key={idx} snippet={snippet} index={idx} />
      ))}
      <form className="p-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Chinese text"
          className="mr-4"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}

export default App;
