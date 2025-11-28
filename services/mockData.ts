import { Slide, SlideType, SessionState } from '../types';

export const INITIAL_SLIDES: Slide[] = [
  {
    id: 's1',
    type: SlideType.POLL,
    question: '您在日常教学/会议中最常遇到的痛点是什么？',
    options: [
      { id: 'o1', label: '听众参与度低', count: 12 },
      { id: 'o2', label: '缺乏实时反馈', count: 8 },
      { id: 'o3', label: '工具操作复杂', count: 5 },
      { id: 'o4', label: '数据难以统计', count: 15 },
    ]
  },
  {
    id: 's2',
    type: SlideType.WORD_CLOUD,
    question: '用一个词形容理想的互动课堂',
    words: [
      { text: '活跃', count: 5 },
      { text: '高效', count: 3 },
      { text: '有趣', count: 4 },
      { text: '启发', count: 2 },
      { text: '连接', count: 2 },
      { text: '创新', count: 1 },
      { text: '轻松', count: 1 },
    ]
  },
  {
    id: 's3',
    type: SlideType.QNA,
    question: '关于互动教学，您有什么疑问？',
    qnaEntries: [
      "如何平衡互动时间和讲课时间？",
      "大班课（100人+）如何保证每个人都能参与？"
    ]
  }
];

export const INITIAL_SESSION: SessionState = {
  code: '8816 2024',
  isActive: true,
  currentSlideIndex: 0,
  slides: INITIAL_SLIDES,
};