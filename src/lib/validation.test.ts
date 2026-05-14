import { Validator, validateRegisterForm, validateSettingsForm } from './validation';

describe('Validator', () => {
  describe('required', () => {
    it('should return error when value is undefined', () => {
      const result = Validator.required(undefined, 'Name');
      expect(result).toEqual({ field: 'Name', message: 'Name is required' });
    });

    it('should return error when value is null', () => {
      const result = Validator.required(null, 'Name');
      expect(result).toEqual({ field: 'Name', message: 'Name is required' });
    });

    it('should return error when value is empty string', () => {
      const result = Validator.required('', 'Name');
      expect(result).toEqual({ field: 'Name', message: 'Name is required' });
    });

    it('should return null when value is provided', () => {
      const result = Validator.required('John', 'Name');
      expect(result).toBeNull();
    });
  });

  describe('email', () => {
    it('should return error when email is invalid', () => {
      const result = Validator.email('invalid-email', 'Email');
      expect(result).toEqual({ field: 'Email', message: 'Email must be a valid email address' });
    });

    it('should return null when email is valid', () => {
      const result = Validator.email('test@example.com', 'Email');
      expect(result).toBeNull();
    });
  });

  describe('minLength', () => {
    it('should return error when value is shorter than min length', () => {
      const result = Validator.minLength('ab', 3, 'Name');
      expect(result).toEqual({ field: 'Name', message: 'Name must be at least 3 characters long' });
    });

    it('should return null when value is equal to min length', () => {
      const result = Validator.minLength('abc', 3, 'Name');
      expect(result).toBeNull();
    });

    it('should return null when value is longer than min length', () => {
      const result = Validator.minLength('abcd', 3, 'Name');
      expect(result).toBeNull();
    });
  });

  describe('maxLength', () => {
    it('should return error when value is longer than max length', () => {
      const result = Validator.maxLength('abcde', 4, 'Name');
      expect(result).toEqual({ field: 'Name', message: 'Name must not exceed 4 characters' });
    });

    it('should return null when value is equal to max length', () => {
      const result = Validator.maxLength('abcd', 4, 'Name');
      expect(result).toBeNull();
    });

    it('should return null when value is shorter than max length', () => {
      const result = Validator.maxLength('abc', 4, 'Name');
      expect(result).toBeNull();
    });
  });

  describe('passwordStrength', () => {
    it('should return error when password is shorter than 8 characters', () => {
      const result = Validator.passwordStrength('Pass123', 'Password');
      expect(result).toEqual({ field: 'Password', message: 'Password must be at least 8 characters long' });
    });

    it('should return error when password has no uppercase letter', () => {
      const result = Validator.passwordStrength('password123', 'Password');
      expect(result).toEqual({ field: 'Password', message: 'Password must contain at least one uppercase letter' });
    });

    it('should return error when password has no lowercase letter', () => {
      const result = Validator.passwordStrength('PASSWORD123', 'Password');
      expect(result).toEqual({ field: 'Password', message: 'Password must contain at least one lowercase letter' });
    });

    it('should return error when password has no number', () => {
      const result = Validator.passwordStrength('Password', 'Password');
      expect(result).toEqual({ field: 'Password', message: 'Password must contain at least one number' });
    });

    it('should return null when password is strong', () => {
      const result = Validator.passwordStrength('Password123', 'Password');
      expect(result).toBeNull();
    });
  });

  describe('matches', () => {
    it('should return error when values do not match', () => {
      const result = Validator.matches('password1', 'password2', 'Confirm Password', 'New Password');
      expect(result).toEqual({ field: 'Confirm Password', message: 'Confirm Password must match New Password' });
    });

    it('should return null when values match', () => {
      const result = Validator.matches('password123', 'password123', 'Confirm Password', 'New Password');
      expect(result).toBeNull();
    });
  });

  describe('username', () => {
    it('should return error when username contains invalid characters', () => {
      const result = Validator.username('user@name', 'Username');
      expect(result).toEqual({ field: 'Username', message: 'Username can only contain letters, numbers, and underscores' });
    });

    it('should return error when username is shorter than 3 characters', () => {
      const result = Validator.username('ab', 'Username');
      expect(result).toEqual({ field: 'Username', message: 'Username must be between 3 and 20 characters long' });
    });

    it('should return error when username is longer than 20 characters', () => {
      const result = Validator.username('abcdefghijklmnopqrstu', 'Username');
      expect(result).toEqual({ field: 'Username', message: 'Username must be between 3 and 20 characters long' });
    });

    it('should return null when username is valid', () => {
      const result = Validator.username('username_123', 'Username');
      expect(result).toBeNull();
    });
  });

  describe('url', () => {
    it('should return error when url is invalid', () => {
      const result = Validator.url('invalid-url', 'Website');
      expect(result).toEqual({ field: 'Website', message: 'Website must be a valid URL' });
    });

    it('should return null when url is valid', () => {
      const result = Validator.url('https://example.com', 'Website');
      expect(result).toBeNull();
    });
  });

  describe('validate', () => {
    it('should return isValid: true when all rules pass', () => {
      const data = { name: 'John Doe', email: 'test@example.com' };
      const rules = {
        name: [
          (value) => Validator.required(value, 'Name'),
          (value) => Validator.minLength(value, 2, 'Name'),
        ],
        email: [
          (value) => Validator.required(value, 'Email'),
          (value) => Validator.email(value, 'Email'),
        ],
      };
      const result = Validator.validate(data, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return isValid: false when some rules fail', () => {
      const data = { name: '', email: 'invalid-email' };
      const rules = {
        name: [
          (value) => Validator.required(value, 'Name'),
        ],
        email: [
          (value) => Validator.email(value, 'Email'),
        ],
      };
      const result = Validator.validate(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});

describe('validateRegisterForm', () => {
  it('should return isValid: true when form data is valid', () => {
    const data = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'Password123',
    };
    const result = validateRegisterForm(data);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return isValid: false when form data is invalid', () => {
    const data = {
      name: '',
      email: 'invalid-email',
      password: 'pass',
    };
    const result = validateRegisterForm(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(4);
  });
});

describe('validateSettingsForm', () => {
  describe('account section', () => {
    it('should return isValid: true when account data is valid', () => {
      const data = {
        username: 'user123',
        displayName: 'User 123',
        website: 'https://example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      };
      const result = validateSettingsForm(data, 'account');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return isValid: false when account data is invalid', () => {
      const data = {
        username: 'us',
        displayName: '',
        website: 'invalid-url',
        avatarUrl: 'invalid-url',
      };
      const result = validateSettingsForm(data, 'account');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(5);
    });
  });

  describe('security section', () => {
    it('should return isValid: true when security data is valid', () => {
      const data = {
        currentPassword: 'Password123',
        newPassword: 'NewPass123',
        confirmPassword: 'NewPass123',
      };
      const result = validateSettingsForm(data, 'security');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return isValid: false when security data is invalid', () => {
      const data = {
        currentPassword: '',
        newPassword: 'pass',
        confirmPassword: 'different',
      };
      const result = validateSettingsForm(data, 'security');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('unknown section', () => {
    it('should return isValid: true for unknown section', () => {
      const data = {};
      const result = validateSettingsForm(data, 'unknown');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
