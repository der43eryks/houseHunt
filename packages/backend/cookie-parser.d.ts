declare module 'cookie-parser' {
  import { Request, Response, NextFunction } from 'express';

  interface CookieParserOptions {
    secret?: string | string[];
    decode?: (val: string) => string;
  }

  function cookieParser(secret?: string | string[], options?: CookieParserOptions): (req: Request, res: Response, next: NextFunction) => void;
  function cookieParser(options?: CookieParserOptions): (req: Request, res: Response, next: NextFunction) => void;

  namespace cookieParser {
    function signedCookies(obj: any, secret: string | string[]): any;
    function JSONCookie(str: string): any;
    function JSONCookies(obj: any): any;
    function signedCookie(str: string, secret: string | string[]): string | false;
    function signedCookies(obj: any, secret: string | string[]): any;
  }

  export = cookieParser;
} 