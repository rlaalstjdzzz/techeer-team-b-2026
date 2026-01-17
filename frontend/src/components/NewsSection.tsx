import React from 'react';
import { ChevronRight, Newspaper } from 'lucide-react';

interface NewsSectionProps {
  isDarkMode: boolean;
}

const newsItems = [
  {
    title: '서울 아파트값 2주 연속 상승세 지속',
    source: '부동산114',
    time: '2시간 전',
    category: '시장동향',
  },
  {
    title: '정부, 주택공급 확대 방안 발표 예정',
    source: '국토교통부',
    time: '5시간 전',
    category: '정책',
  },
  {
    title: '전세사기 피해 예방 체크리스트 공개',
    source: '한국부동산원',
    time: '1일 전',
    category: '전세',
  },
];

export default function NewsSection({ isDarkMode }: NewsSectionProps) {
  return (
    <div className="mb-4">
      {/* 헤더 라인 */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
        <h2 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
          <Newspaper className={`w-5 h-5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
          주요 뉴스
        </h2>
      </div>
      
      {/* 뉴스 목록 */}
      <div>
        {newsItems.map((news, index) => (
          <button
            key={index}
            className={`w-full p-4 text-left transition-colors ${
              index !== newsItems.length - 1
                ? `border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`
                : ''
            } ${
              isDarkMode
                ? 'hover:bg-zinc-800/30'
                : 'hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold leading-snug mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {news.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isDarkMode 
                      ? 'bg-zinc-800 text-zinc-400' 
                      : 'bg-sky-50 text-sky-700'
                  }`}>
                    {news.category}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {news.source}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    ·
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {news.time}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <button
        className={`w-full px-5 py-4 text-sm font-semibold transition-colors border-t ${
          isDarkMode
            ? 'text-sky-400 hover:bg-zinc-800/30 border-zinc-800'
            : 'text-sky-600 hover:bg-zinc-50 border-zinc-200'
        }`}
      >
        더보기
      </button>
    </div>
  );
}
