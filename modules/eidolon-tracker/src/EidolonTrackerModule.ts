import { requireNativeModule } from 'expo-modules-core';

// This links your JavaScript to the Kotlin file
const EidolonTrackerModule = requireNativeModule('EidolonTracker');

export function hasPermission(): boolean {
  return EidolonTrackerModule.hasPermission();
}

export function requestPermission(): void {
  return EidolonTrackerModule.requestPermission();
}

export async function getScreenTime(): Promise<Record<string, number>> {
  return await EidolonTrackerModule.getScreenTime();
}