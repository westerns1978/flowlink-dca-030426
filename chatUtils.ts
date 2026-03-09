
export interface ChatTriggerContext {
  prompt: string;
  contextType?: 'ALERT' | 'INSIGHT' | 'REPORT' | 'DEVICE';
  contextData?: any;
}

export const triggerCricket = (promptOrContext: string | ChatTriggerContext) => {
  let detail: ChatTriggerContext;

  if (typeof promptOrContext === 'string') {
    detail = { prompt: promptOrContext };
  } else {
    detail = promptOrContext;
  }

  const event = new CustomEvent('open-cricket-chat', { detail });
  window.dispatchEvent(event);
};
