import AlWordsList from "@/components/AlWordsList";
import ArabicGrammarApp from "@/components/ArabicGrammarApp";
import ExampleDisplay from "@/components/ExampleDisplay";

import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* <ExampleDisplay surahId={1} ayahNo={2} words={[1,2,3,4]} /> */}
      <ArabicGrammarApp />
      {/* <AlWordsList/> */}
    </>
  );
}
