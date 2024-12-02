export const ROUTES = {
  LOGIN: '/login',
  REGISTRATION: '/registration',
  CHATS: '/chats',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function isValidRoute(path: string): path is Route {
  return Object.values(ROUTES).includes(path as Route);
}
