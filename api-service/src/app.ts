import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import express from "express"
import setRoutePaths from "./routes"

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setRoutePaths(app)

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

interface ErrorObject {
  message: string;
  status?: number; // Assuming status is optional
}
// error handler
app.use(function(
  err: ErrorObject,
  req: Request,
  res: Response,
): void {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
