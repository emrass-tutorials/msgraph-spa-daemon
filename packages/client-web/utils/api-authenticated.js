// see https://github.com/bmvantunes/youtube-2020-march-nextjs-part6/blob/master/src/pages/api/people.ts

import { verify } from "jsonwebtoken"; // TODO: install jsonwebtoken
const secret = process.env.API_JWT_SECRET;

export default authenticated = (fn) => async (req, res) => {
  verify(req.headers.authorization, secret, async function (err, decoded) {
    if (!err && decoded) {
      return await fn(req, res);
    }

    res.status(401).json({ message: "Sorry you are not authenticated" });
  });
};

// use like: export default authenticated(async (req, res) => { /* actual API function */ })
