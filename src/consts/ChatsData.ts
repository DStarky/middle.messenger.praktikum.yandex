import type { MessageData } from '../components/common/Message/Message';
import type { Chat } from '../types/Chat';

export const DEFAULT_CHATS: Chat[] = [
  {
    id: '1',
    avatar: '',
    name: 'Иван Иванов',
    lastMessage: 'Круто',
    isOwn: true,
    time: '12:34',
    unreadCount: 2,
    isActive: false,
  },
  {
    id: '2',
    avatar: '',
    name: 'Петр Петров',
    lastMessage: 'Не хочу с тобой разговаривать',
    isOwn: false,
    time: '21:34',
    unreadCount: 99,
    isActive: false,
  },
];

export const MESSAGES_BY_CHAT_ID: Record<string, MessageData[]> = {
  '1': [
    {
      id: '1',
      text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

      Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
      time: '12:35',
      isOwn: false,
    },
    { id: '2', text: 'Круто!', time: '12:36', isOwn: true },
  ],
  '2': [
    { id: '1', text: 'Здарова!', time: '18:12', isOwn: true },
    {
      id: '2',
      text: 'Не хочу с тобой разговаривать',
      time: '19:55',
      isOwn: false,
    },
  ],
};
