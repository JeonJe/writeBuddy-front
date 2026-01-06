// 예문 타입
export interface ExampleSentence {
  sentence: string;
  translation: string;
}

// 단어 검색 응답
export interface WordSearchResponse {
  word: string;
  meaning: string;
  example: ExampleSentence;
  point: string;
}

// 문법 검색 응답
export interface GrammarSearchResponse {
  expression: string;
  meaning: string;
  correct: ExampleSentence;
  wrong: string;
  tip: string;
}
