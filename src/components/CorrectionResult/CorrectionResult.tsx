import React, { useState, useRef, useEffect } from 'react';
import { Correction, ScoreLevel } from '../../types';
import { RealExamplesList } from '../RealExamplesList/RealExamplesList';
import { chatService } from '../../services/chatService';
import './CorrectionResult.css';

interface CorrectionResultProps {
  correction: Correction;
  onToggleFavorite: (id: number) => void;
  getScoreLevel: (score: number | null) => ScoreLevel;
  onTagClick?: (tag: string) => void;
}

interface WordPopup {
  word: string;
  meaning: string;
  examples: string[];
  x: number;
  y: number;
}

export const CorrectionResult: React.FC<CorrectionResultProps> = ({
  correction,
  onToggleFavorite,
  getScoreLevel,
  onTagClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [popup, setPopup] = useState<WordPopup | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 팝업 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };

    if (popup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popup]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correction.correctedSentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
    const word = e.currentTarget.textContent?.trim();
    if (!word || word.length < 2) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom + 8;

    setIsLoadingWord(true);
    setPopup({
      word,
      meaning: '로딩 중...',
      examples: [],
      x,
      y
    });

    try {
      const response = await chatService.sendQuestion({
        question: `"${word}" 단어의 뜻과 예문 2개를 간단히 알려줘. 형식: 뜻: [뜻] / 예문1: [예문] / 예문2: [예문]`
      });

      // 응답 파싱
      const meaningMatch = response.answer.match(/뜻:\s*([^/]+)/);
      const example1Match = response.answer.match(/예문1:\s*([^/]+)/);
      const example2Match = response.answer.match(/예문2:\s*(.+)/);

      setPopup({
        word,
        meaning: meaningMatch ? meaningMatch[1].trim() : response.answer,
        examples: [
          example1Match ? example1Match[1].trim() : '',
          example2Match ? example2Match[1].trim() : ''
        ].filter(Boolean),
        x,
        y
      });
    } catch (err) {
      setPopup({
        word,
        meaning: '정보를 불러올 수 없습니다.',
        examples: [],
        x,
        y
      });
    } finally {
      setIsLoadingWord(false);
    }
  };

  // 키보드 접근성을 위한 핸들러
  const handleWordKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleWordClick(e as unknown as React.MouseEvent<HTMLSpanElement>);
    }
  };

  // 문장을 단어 단위로 분리하여 클릭 가능하게 렌더링
  const renderClickableWords = (sentence: string) => {
    const words = sentence.split(/(\s+)/);
    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) {
        return <span key={idx}>{word}</span>;
      }
      return (
        <span
          key={idx}
          className="clickable-word"
          onClick={handleWordClick}
          onKeyDown={handleWordKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`${word} 단어 뜻 보기`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <section className="correction-result">
      <div className="result-header">
        <h3>✨ 훨씬 더 멋져졌어요!</h3>
        <div className="result-meta">
          {correction.score && (
            <span className={`score score-${getScoreLevel(correction.score)}`}>
              {correction.score}/10
            </span>
          )}
          <button
            onClick={() => onToggleFavorite(correction.id)}
            className={`favorite-btn ${correction.isFavorite ? 'favorited' : ''}`}
            aria-label={correction.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            aria-pressed={correction.isFavorite}
          >
            {correction.isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      <div className="result-card">
        <div className="sentence-comparison">
          <div className="sentence-block original-block">
            <div className="sentence-label">원문</div>
            <div className="sentence-content">{correction.originSentence}</div>
            {correction.originTranslation && (
              <div className="translation">💬 {correction.originTranslation}</div>
            )}
          </div>

          <div className="sentence-arrow">→</div>

          <div className="sentence-block corrected-block">
            <div className="sentence-header">
              <span className="sentence-label">교정</span>
              <button
                onClick={handleCopy}
                className={`copy-btn ${copied ? 'copied' : ''}`}
                aria-label="교정된 문장 복사"
              >
                {copied ? '✓ 복사됨' : '📋 복사'}
              </button>
            </div>
            <div className="sentence-content clickable-sentence">
              {renderClickableWords(correction.correctedSentence)}
            </div>
            {correction.correctedTranslation && (
              <div className="translation">💬 {correction.correctedTranslation}</div>
            )}
            <div className="word-hint">💡 단어를 클릭하면 뜻을 볼 수 있어요</div>
          </div>
        </div>

        {/* 단어 팝업 */}
        {popup && (
          <div
            ref={popupRef}
            className="word-popup"
            role="dialog"
            aria-label={`${popup.word} 단어 정보`}
            style={{
              left: `${Math.min(popup.x, window.innerWidth - 280)}px`,
              top: `${popup.y}px`
            }}
          >
            <div className="popup-header">
              <span className="popup-word">{popup.word}</span>
              <button
                className="popup-close"
                onClick={() => setPopup(null)}
                aria-label="팝업 닫기"
              >
                ✕
              </button>
            </div>
            {isLoadingWord ? (
              <div className="popup-loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            ) : (
              <>
                <div className="popup-meaning">{popup.meaning}</div>
                {popup.examples.length > 0 && (
                  <div className="popup-examples">
                    {popup.examples.map((ex, idx) => (
                      <div key={idx} className="popup-example">📌 {ex}</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="feedback-section">
          <div className="feedback-label">🧠 AI 피드백</div>
          <div className="feedback-content">{correction.feedback}</div>
          <div className="feedback-type-badge" data-type={correction.feedbackType}>
            {correction.feedbackType}
          </div>
        </div>

        {correction.relatedExamples && correction.relatedExamples.length > 0 && (
          <div className="examples-section">
            <RealExamplesList
              examples={correction.relatedExamples}
              title="🎬 실제 사용 예시"
              onTagClick={onTagClick}
            />
          </div>
        )}
      </div>
    </section>
  );
};
