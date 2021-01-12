import React from 'react'

export let stepSubscribers = []

export const subscribeToStep = (subscriber, interval=1) => {
  if (stepSubscribers.find(o => o.subscriber == subscriber) != undefined) return;
  stepSubscribers.push({subscriber, interval})
}

export const unsubscribeToStep = (unsubscriber) => stepSubscribers = stepSubscribers.filter(o => o.subscriber != unsubscriber)

export const step = (iter) => {
  stepSubscribers.forEach(o => {
    if (!iter || iter % o.interval == 0) {
      o.subscriber()
    }
  });
}

export const useStep = (subscriber, watches=[], interval=1) => {
  const shouldSubscribe = subscriber && typeof subscriber == 'function'
  React.useEffect(() => {
    if (shouldSubscribe) {
      subscriber();
      subscribeToStep(subscriber, interval)
      return () => unsubscribeToStep(subscriber)
    }
  }, watches)
  return step
}
