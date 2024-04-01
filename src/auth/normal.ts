import { Request, Response, NextFunction } from 'express';
const { authorization } = require('config/config');

export const normalAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const allowedIPs: string[] = [
    '1'
  ];

  const clientIP = req.ip?.split(':').pop() ?? ''; // Extract the IPv4 address or use an empty string as default
  const clientHeaders = req.headers;

  if (!req.headers.authorization) {
    console.log('Missing authorization');
    console.log("Request from " + req.ip + " to " + req.path);
    console.log("Headers", req.headers);
    console.log("Body", req.body)
    res.status(401).send({
      error: 'No authorization',
    });
  }

  if (req.headers.authorization && req.headers.authorization !== authorization.authkey) {
    console.log('Invalid authorization');
    console.log("Request from " + req.ip + " to " + req.path);
    console.log("Headers", req.headers);
    console.log("Body", req.body)
    res.status(401).send({
      error: 'Invalid authorization',
    });
  }

  if ((clientHeaders.authorization === authorization.authkey) && !allowedIPs.includes(clientIP)) {
    console.log('Not allowed');
    console.log("Request from " + req.ip + " to " + req.path);
    console.log("Headers", req.headers);
    console.log("Body", req.body)
    res.status(401).send({
      error: 'Not allowed',
    });
  }

  if ((clientHeaders.authorization === authorization.authkey) && allowedIPs.includes(clientIP)) {
    return next();
  }
};
