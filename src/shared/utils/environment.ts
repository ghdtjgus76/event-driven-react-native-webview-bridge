interface EnvironmentInfo {
  os: "Android" | "iOS" | "Windows" | "MacOS" | "Linux" | "Unknown";
  deviceType: "Mobile" | "Tablet" | "Desktop" | "Unknown";
  isWebView: boolean;
  isBrowser: boolean;
}

export const detectEnvironment = (): EnvironmentInfo => {
  const userAgent = navigator.userAgent || "";

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isWindows = /windows nt/i.test(userAgent);
  const isMacOS = /macintosh|mac os x/i.test(userAgent);
  const isLinux = /linux/i.test(userAgent) && !isAndroid;

  let os: EnvironmentInfo["os"] = "Unknown";
  if (isAndroid) os = "Android";
  else if (isIOS) os = "iOS";
  else if (isWindows) os = "Windows";
  else if (isMacOS) os = "MacOS";
  else if (isLinux) os = "Linux";

  const isMobile = /mobile/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  let deviceType: EnvironmentInfo["deviceType"] = "Unknown";
  if (isMobile) deviceType = "Mobile";
  else if (isTablet) deviceType = "Tablet";
  else if (isDesktop) deviceType = "Desktop";

  const isWebView =
    /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent) ||
    /Android.*(wv)/i.test(userAgent);

  const isBrowser =
    !isWebView &&
    typeof window !== "undefined" &&
    typeof document !== "undefined";

  return {
    os,
    deviceType,
    isWebView,
    isBrowser,
  };
};
