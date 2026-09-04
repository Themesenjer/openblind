"use client";

export const haptics = {
  /**
   * Single short pulse for turn or action (100ms)
   */
  shortPulse: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(100);
      } catch (e) {
        console.warn("Haptics error", e);
      }
    }
  },

  /**
   * Double pulse for beacon proximity / target reached ([100ms, 80ms, 100ms])
   */
  beaconReached: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([100, 80, 100]);
      } catch (e) {
        console.warn("Haptics error", e);
      }
    }
  },

  /**
   * Triple intense pulse for emergency SOS or hazard alert ([200ms, 100ms, 200ms, 100ms, 300ms])
   */
  emergencyAlert: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch (e) {
        console.warn("Haptics error", e);
      }
    }
  }
};
