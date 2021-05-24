/* eslint-disable no-console */
/*!
 * MIT License
 *
 * Copyright (c) 2021 Government Digital Service
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Request, Response, Router } from "express";
import { PageSetup } from "../../../interfaces/PageSetup";
import { pathName } from "../../../paths";
import { Engine } from "../../engine";

// This is the root route and will redirect back to the appropriate gov.uk start page
const getIPV = (req: Request, res: Response): void => {
  if (
    req.query.response_type &&
    req.query.redirect_uri &&
    req.query.state &&
    req.query.client_id
  ) {
    req.session.oauth = {
      response_type: req.query.response_type,
      redirect_uri: req.query.redirect_uri,
      state: req.query.state,
      client_id: req.query.client_id,
    };
    const engine = new Engine();
    engine.start(req, res);
  } else {
    res.redirect("/error");
  }
};

@PageSetup.register
class SetupIPVController {
  initialise(): Router {
    const router = Router();
    router.get(pathName.public.IPV, getIPV);

    return router;
  }
}

export { SetupIPVController, getIPV };
