export const SUSPEND = '@@redux-suspend-resume/SUSPEND';
export const RESUME = '@@redux-suspend-resume/RESUME';
export const TRIGGER_NOTIFICATION = '@@redux-suspend-resume/TRIGGER';

export function suspendAction() {
  return { type: SUSPEND };
}

export function resumeAction() {
  return { type: RESUME };
}

export function triggerNotificationAction() {
  return { type: TRIGGER_NOTIFICATION };
}
