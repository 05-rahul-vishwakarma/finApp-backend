import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
  Min,
  IsIn,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  // ============================================
  // REQUIRED
  // ============================================

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('IN', { message: 'Please provide a valid Indian phone number' })
  @Transform(({ value }) => value?.trim())
  phoneNumber: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @Transform(({ value }) => value?.trim())
  fullName: string;

  // ============================================
  // OPTIONAL
  // ============================================

  @IsOptional()
  @IsEmail({ 
    require_tld: true,           // Require top-level domain
    allow_display_name: false,   // Don't allow "Name <email>"
    allow_utf8_local_part: false, // Only ASCII for local part
  }, { 
    message: 'Please provide a valid email address (e.g., user@domain.com)' 
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value) || 0)
  monthlyIncome?: number;

  @IsOptional()
  @IsString()
  @IsIn(['INR', 'USD', 'EUR', 'GBP', 'JPY'])
  @Transform(({ value }) => value?.toUpperCase() || 'INR')
  currencyCode?: string;
}