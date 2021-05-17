import { NextFunction, Request, Response } from "express";
import { SinonStub } from "sinon";

import {
  logErrorMiddleware,
  logRequestMiddleware,
} from "../../../app/middleware/logger-middleware";
import Logger from "../../../app/utils/logger";
import { expect, sinon } from "../../utils/testUtils";

describe("Logger Middleware", () => {
  let sandbox: sinon.SinonSandbox;
  let logRequestStub: SinonStub;
  let logExceptionStub: SinonStub;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const error = { message: "This is an error" };
  const logger: Logger = new Logger();

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      session: {},
      cookies: {},
      app: {
        locals: {
          knownPaths: [],
          logger,
        },
      } as any,
    } as Partial<Request>;

    res = {
      render: sandbox.stub(),
      send: sandbox.stub(),
    } as Partial<Response>;

    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("logRequestMiddleware should call logger.debug", function () {
    logRequestStub = sinon.stub(logger, "debug");
    logRequestMiddleware(req as Request, res as Response, next);

    expect(logRequestStub).to.have.been.called;
    expect(next).to.have.been.calledOnce;
  });

  it("logErrorMiddleware should call logger.error", function () {
    logExceptionStub = sinon.stub(logger, "error");
    logErrorMiddleware(error, req as Request, res as Response, next);

    expect(logExceptionStub).to.have.been.called;
    expect(next).to.have.been.calledOnce.calledWith(error);
  });
});
