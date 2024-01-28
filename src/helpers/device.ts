import { nanoid } from 'nanoid';
import Bowser from 'bowser';

export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = nanoid();
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

export const getDeviceDetails = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);

  const deviceDetails = {
    browser: browser.getBrowserName(),
    browserVersion: browser.getBrowserVersion(),
    os: browser.getOSName(),
    osVersion: browser.getOSVersion(),
    platform: browser.getPlatformType(),
  };

  return deviceDetails;
};
