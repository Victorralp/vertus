declare module 'busboy' {
  import { IncomingHttpHeaders } from 'http';
  import { Writable } from 'stream';

  interface BusboyConfig {
    headers: IncomingHttpHeaders;
    [key: string]: unknown;
  }

  interface BusboyFileInfo {
    filename: string;
    encoding: string;
    mimeType: string;
  }

  interface BusboyFileStream extends NodeJS.ReadableStream {}

  interface BusboyInstance extends Writable {
    on(
      event: 'file',
      listener: (
        fieldname: string,
        file: BusboyFileStream,
        info: BusboyFileInfo
      ) => void
    ): this;
    on(
      event: 'field',
      listener: (fieldname: string, value: string) => void
    ): this;
    on(event: 'finish', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
  }

  function Busboy(config: BusboyConfig): BusboyInstance;

  export = Busboy;
}
