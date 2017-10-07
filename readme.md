# redux-suspend-resue
Store enhancer and action creator that enables suspending/resuming subscriber notifications. 
Inspired by [redux-batch-enhancer](https://github.com/abc123s/redux-batch-enhancer).

# Usage
To enable, apply the provided store enhancer (```supendResumeEnhancer```):
```javascript
import { createStore } from 'redux'
import { suspendResumeEnhancer } from 'redux-suspend-resume'

const store = createStore(
  reducer,
  compose(
    <...other enhancers, applyMiddleware, ...>
    suspendResumeEnhancer,
  )
);
```
Note: ```supendResumeEnhancer``` overwrites dispatch and subscribe on the original redux store, 
and thus must be applied before any middleware or store enhancers that depend on these two methods.
Since `compose` composes the enhancers from right to left, it should be *last* if used with `compose`

# Example Usage
```javascript
import { suspendAction, triggerNotificationAction, resumeAction } from 'redux-suspend-resume'

dispatch(suspendAction());
<... other actions and code that may modify the redux store without causing notifications>
dispatch(triggerNotificationAction()); // trigger "single" notification run
<...>
dispatch(resumeAction()); // back to normal store notification behavior
```
