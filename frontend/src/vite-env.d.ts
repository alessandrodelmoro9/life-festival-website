/// <reference types="vite/client" />

interface EventbriteWidgetOptions {
  widgetType: string;
  eventId: string;
  modal?: boolean;
  modalTriggerElementId?: string;
  onOrderComplete?: () => void;
}

interface Window {
  EBWidgets?: {
    createWidget: (options: EventbriteWidgetOptions) => void;
  };
}
