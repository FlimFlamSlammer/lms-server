import { Request } from "express";

export function splitCookieString(cookieString: string) {
  const cookieStrings = cookieString.split("; ");
  const cookies: Record<string, string> = {};

  cookieStrings?.forEach((cookieString: string) => {
    const [key, value] = cookieString.split("=");
    cookies[key] = value;
  });

  return cookies;
}
