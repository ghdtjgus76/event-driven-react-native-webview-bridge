import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";

type Version = `${number}.${number}.${number}`;
type HandlerFunction = (...params: any[]) => any;
export interface VersionHandlers {
  [version: Version]: {
    [functionName: string]: HandlerFunction;
  };
}

class VersionHandlingPlugin extends WebViewBridgePlugin {
  private versionHandlers: VersionHandlers;

  constructor(versionHandlers: VersionHandlers) {
    super();
    this.versionHandlers = versionHandlers;
  }

  public execute(
    currentVersion: Version,
    functionName: keyof VersionHandlers[Version],
    ...params: any[]
  ) {
    const sortedVersions = (
      Object.keys(this.versionHandlers) as Version[]
    ).sort(compareVersions);

    for (let i = sortedVersions.length - 1; i >= 0; i--) {
      const version = sortedVersions[i]!;

      if (compareVersions(version, currentVersion) <= 0) {
        const handlers = this.versionHandlers[version];
        const handler = handlers?.[functionName];

        if (handler) {
          handler(...params);
          return;
        }
      }
    }

    console.warn(
      `No handler found for function "${functionName}" and version "${currentVersion}"`
    );
  }
}

const compareVersions = (v1: Version, v2: Version) => {
  const [major1 = 0, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
  const [major2 = 0, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);

  if (major1 !== major2) return major1 - major2;
  if (minor1 !== minor2) return minor1 - minor2;
  return patch1 - patch2;
};

export default VersionHandlingPlugin;
