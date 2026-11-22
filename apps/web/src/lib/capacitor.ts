interface AdMobPlugin {
  initialize(): Promise<void>;
  prepareInterstitial(options: { adId: string; isTesting: boolean }): Promise<void>;
  showInterstitial(): Promise<void>;
  prepareRewardVideoAd(options: { adId: string; isTesting: boolean }): Promise<void>;
  showRewardVideoAd(): Promise<{ amount?: number; type?: string } | undefined>;
  addListener?: (
    event: string,
    listener: () => void
  ) => Promise<{ remove(): Promise<void> }>;
}

interface CapacitorBridge {
  getPlatform(): string;
  Plugins?: {
    AdMob?: AdMobPlugin;
  };
}

export function getCapacitor(): CapacitorBridge | undefined {
  return (window as Window & { Capacitor?: CapacitorBridge }).Capacitor;
}
