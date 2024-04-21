import { TrackingEvent } from '../constants';
import mixpanel from 'mixpanel-browser';
import { getDeviceDetails } from './device';
import config from '../config';

export const track = (eventName: TrackingEvent, data?: Record<string, any>) => {
  if (config.env === 'local') {
    return;
  }

  mixpanel.track(eventName, { ...getDeviceDetails(), ...(data || {}) });
};
