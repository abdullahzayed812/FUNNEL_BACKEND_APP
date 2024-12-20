import { RequestHandler } from "express";

export interface JwtPayload {
  userId: string;
}

export type WithError<T> = T & { error: string };

export type ExpressHandler<Req, Res> = RequestHandler<string, Partial<WithError<Res>>, Partial<Req>, any>;

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;
