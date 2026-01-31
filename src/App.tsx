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

function WordReading({ word, reading }: { word: string; reading: string }) {
  return (
    <div className="inline-block">
      <div className="text-6xl font-bold">{word}</div>
      <div className="text-xs">{reading}</div>
    </div>
  );
}

function Snippet({
  snippet,
  key,
  index,
  isTraditional,
  onToggleTraditional,
  isPinyin,
  onTogglePinyin,
}: {
  snippet: SnippetData;
  key: number;
  index: number;
  isTraditional: boolean;
  onToggleTraditional: (index: number) => void;
  isPinyin: boolean;
  onTogglePinyin: (index: number) => void;
}) {
  const { query, trad, simp } = snippet;
  const activeVariant = isTraditional ? trad : simp;
  let backgroundColor = "bg-gray-400";
  if (index % 2 === 1) {
    backgroundColor = "bg-gray-100";
  }
  const activeReading = isPinyin
    ? activeVariant.pinyin_by_words.map(([word, pinyin]) => (
        <WordReading word={word} reading={pinyin} />
      ))
    : activeVariant.jyutping_by_words.map(([word, jyutping]) => (
        <WordReading word={word} reading={jyutping} />
      ));

  return (
    <div key={key} className={`${backgroundColor} p-4 rounded-lg my-2`}>
      <div className="flex justify-between items-center">
        <div className="ml-4">
          <p>{activeReading}</p>
        </div>
        <div>
          <button
            onClick={() => onToggleTraditional(index)}
            className="px-4 py-2 m-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {isTraditional ? "简" : "繁"}
          </button>
          <button
            onClick={() => onTogglePinyin(index)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {isPinyin ? "國" : "粵"}
          </button>
        </div>
      </div>

      <div className="mb-6"></div>

      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-base">
          <strong>Original:</strong> {query}
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
  const [isTraditionalByDefault, setIsTraditionalByDefault] = useState(true);
  const [isPinyinByDefault, setIsPinyinByDefault] = useState(true);
  const [traditionalModes, setTraditionalModes] = useState<boolean[]>([
    isTraditionalByDefault,
  ]);
  const [pinyinModes, setPinyinModes] = useState<boolean[]>([
    isPinyinByDefault,
  ]);

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
      setTraditionalModes([...traditionalModes, isTraditionalByDefault]);
      setPinyinModes([...pinyinModes, isPinyinByDefault]);
      setInputValue("");
    } catch (error) {
      console.error("Error fetching transliteration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTraditionalByDefaultHandler = () => {
    setIsTraditionalByDefault(!isTraditionalByDefault);
  };

  const switchPinyinByDefaultHandler = () => {
    setIsPinyinByDefault(!isPinyinByDefault);
  };

  const toggleTraditionalMode = (index: number) => {
    setTraditionalModes((prev) => {
      const newModes = [...prev];
      newModes[index] = !newModes[index];
      return newModes;
    });
  };

  const togglePinyinMode = (index: number) => {
    setPinyinModes((prev) => {
      const newModes = [...prev];
      newModes[index] = !newModes[index];
      return newModes;
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1>Pinyin Jyutping Lookup</h1>
        <div>
          <span className="mr-2">Default:</span>
          <button
            onClick={switchTraditionalByDefaultHandler}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isTraditionalByDefault ? "繁" : "简"}
          </button>
          <button
            onClick={switchPinyinByDefaultHandler}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isPinyinByDefault ? "國" : "粵"}
          </button>
        </div>
      </div>
      <div className="text-left">
        <p>
          This is a tool to look up pinyin and jyutping for Chinese characters.
          All you need to do is copy and paste in a snippet of Chinese in the
          input box at the bottom of the page, and the Mandarin and Cantonese
          transliterations will appear in a few seconds. You can also toggle
          between simplified and traditional characters, and between pinyin and
          jyutping, for each snippet.
        </p>
      </div>
      <p className="text-left"></p>
      {transliterations.map((snippet, idx) => (
        <Snippet
          key={idx}
          snippet={snippet}
          index={idx}
          isTraditional={traditionalModes[idx] ?? isTraditionalByDefault}
          onToggleTraditional={toggleTraditionalMode}
          isPinyin={pinyinModes[idx] ?? isPinyinByDefault}
          onTogglePinyin={togglePinyinMode}
        />
      ))}
      <form className="p-4 flex" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Chinese text"
          className="mr-4 border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          type="submit"
          disabled={isLoading}
        >
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
