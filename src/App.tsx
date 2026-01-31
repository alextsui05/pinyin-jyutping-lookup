import { useState } from "react";
import "./App.css";
import sampleData from "./assets/sample.json";

type WordBreakdown = [string, string][];

type TextVariant = {
  text: string;
  pinyin_by_words: WordBreakdown;
  jyutping_by_words: WordBreakdown;
};

type SnippetData = {
  query: string;
  pinyin: string;
  jyutping: string;
  trad: TextVariant;
  simp: TextVariant;
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
  const { query, jyutping, pinyin, trad, simp } = snippet;
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
      <p className={`${fontSize} font-bold mb-10`}>{query}</p>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Traditional: {trad.text}</h3>
        <div className="ml-4">
          <p className="text-sm text-gray-600">Pinyin by words:</p>
          <p>
            {trad.pinyin_by_words
              .map(([word, pinyin]) => `${word} (${pinyin})`)
              .join(" ")}
          </p>
          <p className="text-sm text-gray-600 mt-2">Jyutping by words:</p>
          <p>
            {trad.jyutping_by_words
              .map(([word, jyutping]) => `${word} (${jyutping})`)
              .join(" ")}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Simplified: {simp.text}</h3>
        <div className="ml-4">
          <p className="text-sm text-gray-600">Pinyin by words:</p>
          <p>
            {simp.pinyin_by_words
              .map(([word, pinyin]) => `${word} (${pinyin})`)
              .join(" ")}
          </p>
          <p className="text-sm text-gray-600 mt-2">Jyutping by words:</p>
          <p>
            {simp.jyutping_by_words
              .map(([word, jyutping]) => `${word} (${jyutping})`)
              .join(" ")}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-sm">
          <strong>Full Pinyin:</strong> {pinyin}
        </p>
        <p className="text-sm">
          <strong>Full Jyutping:</strong> {jyutping}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [transliterations, setTransliterations] = useState<SnippetData[]>([
    sampleData as SnippetData,
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
      <h1>Pinyin Jyutping Lookup</h1>
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
