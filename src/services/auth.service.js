import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import User from '../models/customer.model';
import { RegisterDtoType } from '../types/requests/auth.dto';
import { ApiError } from '../utils/errors/api.error';
import logger from '../utils/logger';
import { EmailService } from './email.service';

export class AuthService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public async registerUser(userData: RegisterDtoType) {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }

    // Generate verification token
    const verificationToken = uuidv4();
    
    // Create user
    const newUser = new User({
      ...userData,
      verificationToken,
      isVerified: false
    });
    
    await newUser.save();
    
    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        userData.email,
        userData.firstName,
        verificationToken
      );
    } catch (error) {
      logger.error('Error sending verification email', error);
      // We don't want to fail user creation if email fails
    }
    
    return {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role
    };
  }

  public async loginUser(email: string, password: string) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      throw new ApiError(403, 'Email not verified');
    }
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  public async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new ApiError(400, 'Invalid verification token');
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return true;
  }

  public async requestPasswordReset(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    const resetToken = uuidv4();
    user.verificationToken = resetToken;
    await user.save();
    
    await this.emailService.sendPasswordResetEmail(
      email,
      user.firstName,
      resetToken
    );
    
    return true;
  }

  public async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new ApiError(400, 'Invalid reset token');
    }
    
    user.password = newPassword;
    user.verificationToken = undefined;
    await user.save();
    
    return true;
  }

  private generateToken(user: any) {
    return jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}