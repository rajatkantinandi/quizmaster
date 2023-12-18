import { TrackingEvent } from '../constants';
import mixpanel from 'mixpanel-browser';

export const track = (eventName: TrackingEvent, data?: Record<string, any>) => {
  mixpanel.track(eventName, data || {});
};
