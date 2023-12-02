import { TrackingEvent } from '../constants';
import mixpanel from 'mixpanel-browser';
import { getDeviceDetails } from './device';

export const track = (eventName: TrackingEvent, data?: Record<string, any>) => {
  mixpanel.track(eventName, {
    ...getDeviceDetails(),
    ...(data || {}),
  });
};
