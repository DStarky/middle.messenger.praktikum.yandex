export const ROUTES = {
  MAIN: '/',
  LOGIN: '/sign-in',
  REGISTRATION: '/sign-up',
  CHATS: '/messenger',
  PROFILE: '/settings',
  NOT_FOUND: '/404',
  ERROR_500: '/500',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function isValidRoute(path: string): path is Route {
  return Object.values(ROUTES).includes(path as Route);
}
