'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suspendAction = suspendAction;
exports.resumeAction = resumeAction;
exports.triggerNotificationAction = triggerNotificationAction;
var SUSPEND = exports.SUSPEND = '@@redux-suspend-resume/SUSPEND';
var RESUME = exports.RESUME = '@@redux-suspend-resume/RESUME';
var TRIGGER_NOTIFICATION = exports.TRIGGER_NOTIFICATION = '@@redux-suspend-resume/TRIGGER';

function suspendAction() {
  return { type: SUSPEND };
}

function resumeAction() {
  return { type: RESUME };
}

function triggerNotificationAction() {
  return { type: TRIGGER_NOTIFICATION };
}