declare module 'express' {
  interface Request {
    user: {
      id: string;
    };
    headers: {
      authorization: `Bearer ${string}`;
      walkflow_userid: string;
    };
    ip: string;
    method: string;
    path: string;
    body: any;
  }
}

interface ExtensionSchemaV1 {
  screenRecordingUrl: string;
  clicks: {
    x: number;
    y: number;
    w: number;
    h: number;
    t: number;
    innerText: string;
    screenshotUrl: string;
  }[];
}

interface ChapterStep {
  uid: string;
  type: 'chapter';
  name?: string;
  title?: string;
  subtitle?: string;
  align: 'left' | 'center' | 'right';
  actions: {
    type: 'button';
    text: string;
    destination: string;
  }[];
}

interface HotSpotStep {
  uid: string;
  type: 'hotspot';
  name?: string;
  title?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  align: 'left' | 'center' | 'right';
  screenshotUrl: string;
  destination: string;
}

interface FlowSchemaV1 {
  version: '1.0';
  designer: {
    background?: string;
  };
  config: {
    screenRecordingUrl: string;
    steps: Array<ChapterStep | HotSpotStep>;
  };
}
