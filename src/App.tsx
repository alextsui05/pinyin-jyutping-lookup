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
  isTraditional,
  onToggleTraditional,
}: {
  snippet: SnippetData;
  key: number;
  index: number;
  isTraditional: boolean;
  onToggleTraditional: (index: number) => void;
}) {
  const { query, jyutping, pinyin, trad, simp } = snippet;
  const activeVariant = isTraditional ? trad : simp;
  let fontSize = "text-8xl";
  if (query.length > 10) {
    fontSize = "text-6xl";
  }
  let backgroundColor = "bg-gray-400";
  if (index % 2 === 1) {
    backgroundColor = "bg-gray-100";
  }
  return (
    <div key={key} className={`${backgroundColor} p-4 rounded-lg my-2`}>
      <div className="flex justify-between items-center">
        <p className={`${fontSize} font-bold m-5`}>{activeVariant.text}</p>
        <button
          onClick={() => onToggleTraditional(index)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {isTraditional ? "简" : "繁"}
        </button>
      </div>

      <div className="mb-6">
        <div className="ml-4">
          <p className="text-sm text-gray-600">Pinyin by words:</p>
          <p>
            {activeVariant.pinyin_by_words
              .map(([word, pinyin]) => `${word} (${pinyin})`)
              .join(" ")}
          </p>
          <p className="text-sm text-gray-600 mt-2">Jyutping by words:</p>
          <p>
            {activeVariant.jyutping_by_words
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
  const [isTraditionalByDefault, setIsTraditionalByDefault] = useState(true);
  const [traditionalModes, setTraditionalModes] = useState<boolean[]>([
    isTraditionalByDefault,
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

  const toggleTraditionalMode = (index: number) => {
    setTraditionalModes((prev) => {
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isTraditionalByDefault ? "繁" : "简"}
          </button>
        </div>
      </div>
      <div className="text-left">
        <p>
          This is a tool to look up pinyin and jyutping for Chinese characters.
          All you need to do is copy and paste in a snippet of Chinese in the
          input box at the bottom of the page, and the Mandarin and Cantonese
          transliterations will appear in a few seconds. You can also toggle
          between simplified and traditional characters for each snippet. Feel
          free to use the sample Chinese text:
        </p>
        <p className="mt-2 bg-gray-100 p-10">
          基礎知識和術語 由於 Flexbox
          是一個完整的模組，而不是單一屬性，因此它涉及許多方面，包括其所有屬性。其中一些屬性需要設定在容器（父元素，稱為「flex
          容器」）上，而有些屬性則需要設定在子元素（稱為「flex 項目」）上。
          如果說「常規」佈局是基於區塊級和行內兩種流方向，那麼彈性佈局則是基於「彈性流方向」。請參考規範中的這張圖，它解釋了彈性佈局背後的主要想法。
          一張解釋 Flexbox 術語的圖表。 Flexbox
          主軸方向上的尺寸稱為主尺寸，反方向的尺寸稱為交叉尺寸。這些尺寸都有主起始點、主結束點、交叉起始點和交叉結束點。
          項目將按照main
          axis（從main-start到main-end）或交叉軸（從cross-start到cross-end）進行佈局。
          主軸–
          彈性容器的主軸是彈性元素佈局的主要軸線。請注意，它不一定是水平的；這取決於屬性flex-direction（見下文）。
          main-start | main-end – flex 專案放置在容器內，從 main-start 開始，到
          main-end 結束。
          主尺寸－彈性項目的寬度或高度（取其位於主要尺寸內的值）即為該項目的主尺寸。彈性項目的主尺寸屬性為「寬度」或「高度」屬性，取其位於主要尺寸內的值。
          橫軸－垂直於主軸的軸稱為橫軸。它的方向取決於主軸的方向。 交叉起始 |
          交叉結束–
          彈性線填滿了項目，並從彈性容器的交叉起始側開始，向交叉結束側放置到容器中。
          橫向尺寸–
          彈性項目的寬度或高度（以橫向尺寸為準）即為該項目的橫向尺寸。橫向尺寸屬性的值取自“寬度”或“高度”中的“寬度”或“高度”。
        </p>
        <p className="mt-2 bg-gray-100 p-10">
          对于算是推理类的avg而言，本作设定在怪谈类上不算独有创新，都结合开局类圣杯战争的大逃杀剧情后，诅咒和咒珠的设定便跃然纸上，让人拥有深刻的爽感与印象。整篇自圆其说，逻辑性不差，人物设定有趣，对话生动且关系环环相扣，多故事分支提高群像爽感与故事沉浸了解度。本人智商不高，简单看过资料与回顾对话后也能算是理解故事全篇意味，挑不出故事中的漏洞或错处牵强，姑且如此认为。
          本篇序章可能是最吓人的，有一些jumpscare（别的有但不多，有心理准备）但过了杀杀杀环节后就没有火力不足的恐惧了，后面都是故事的推进，诅咒者杀心不重且对其效果有了理解，氛围也因为角色间对话的诙谐与打趣而变得不那么沉重或恐怖。基本上每一组主视角双组合都有缓解气氛的小太阳担当，不必因为害怕不敢玩：）加油加油
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
        />
      ))}
      <form className="p-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Chinese text"
          className="mr-4"
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
