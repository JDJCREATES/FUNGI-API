import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import UserRoutes from './UserRoutes';
import AuthRoutes from './AuthRoutes';
import mushroomRoutes from './mushrooms';
import { authenticateUser, authorizeAdmin } from '@src/middleware/auth';
import { authLimiter } from '../ratelimit';

// Create the base router
const baseRouter = Router();

// ** Add UserRouter ** //
const userRouter = Router();
// Fix: Don't return the response object from the handler
userRouter.get(Paths.Users.Get, (req, res) => {
  UserRoutes.getAll(req, res);
});
userRouter.post(Paths.Users.Add, (req, res) => {
  UserRoutes.add(req, res);
});
userRouter.put(Paths.Users.Update, (req, res) => {
  UserRoutes.update(req, res);
});
userRouter.delete(Paths.Users.Delete, (req, res) => {
  UserRoutes.delete(req, res);
});
baseRouter.use(Paths.Users.Base, userRouter);

// ** Add AuthRouter ** //
const authRouter = Router();
// Fix: Don't return the response object from the handler
authRouter.post(Paths.Auth.Register, (req, res) => {
  AuthRoutes.register(req, res);
});
authRouter.post(Paths.Auth.Login, (req, res) => {
  AuthRoutes.login(req, res);
});
authRouter.get(Paths.Auth.Me, authenticateUser, (req, res) => {
  AuthRoutes.getCurrentUser(req, res);
});
// Add refresh token route
authRouter.post('/refresh-token', (req, res) => {
  AuthRoutes.refreshToken(req, res);
});
// Add reset password route
authRouter.post('/reset-password', authenticateUser, (req, res) => {
  AuthRoutes.resetPassword(req, res);
});
baseRouter.use(Paths.Auth.Base, authRouter);

// ** Add MushroomRouter ** //
baseRouter.use(Paths.Mushrooms.Base, mushroomRoutes);

// Add a test route to verify the router is working
baseRouter.get('/test', (req, res) => {
  res.json({ message: 'API router is working!' });
});

export default baseRouter;
