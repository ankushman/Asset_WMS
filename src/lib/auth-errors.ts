/**
 * Utility for mapping raw Supabase / Backend authentication error messages
 * into professional, user-friendly enterprise notification messages.
 */

export interface FriendlyAuthError {
  title: string;
  message: string;
  showTryAgain?: boolean;
}

export function formatAuthError(rawError: string | null | undefined): FriendlyAuthError {
  if (!rawError) {
    return {
      title: 'Authentication Error',
      message: 'Something went wrong. Please try again in a few moments.',
      showTryAgain: true,
    };
  }

  // Log raw technical error to development console
  if (process.env.NODE_ENV === 'development') {
    console.error('[Enterprise Auth Error Log]:', rawError);
  }

  const errorLower = rawError.toLowerCase();

  // If already formatted as friendly message
  if (errorLower.includes('email or password you entered is incorrect')) {
    return {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect.',
      showTryAgain: true,
    };
  }

  // 1. Email Rate Limit Exceeded
  if (
    errorLower.includes('email rate limit exceeded') ||
    errorLower.includes('over_email_send_rate_limit') ||
    errorLower.includes('rate limit')
  ) {
    return {
      title: 'Rate Limit Reached',
      message: "We've sent several emails recently. Please wait a few minutes before requesting another verification email.",
      showTryAgain: true,
    };
  }

  // 2. Invalid Login Credentials
  if (
    errorLower.includes('invalid login credentials') ||
    errorLower.includes('invalid_credentials') ||
    errorLower.includes('invalid grant') ||
    errorLower.includes('wrong password') ||
    errorLower.includes('invalid') ||
    errorLower.includes('incorrect')
  ) {
    return {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect.',
      showTryAgain: true,
    };
  }

  // 3. User Already Registered
  if (
    errorLower.includes('user already registered') ||
    errorLower.includes('already exists') ||
    errorLower.includes('user_already_exists')
  ) {
    return {
      title: 'Account Exists',
      message: 'An account with this email already exists. Please sign in instead.',
      showTryAgain: false,
    };
  }

  // 4. Email Not Confirmed
  if (
    errorLower.includes('email not confirmed') ||
    errorLower.includes('unconfirmed')
  ) {
    return {
      title: 'Email Verification Required',
      message: 'Please verify your email address before signing in.',
      showTryAgain: true,
    };
  }

  // 5. Network or Connection Errors
  if (
    errorLower.includes('failed to fetch') ||
    errorLower.includes('network') ||
    errorLower.includes('timeout')
  ) {
    return {
      title: 'Connection Issue',
      message: 'Unable to connect. Please check your internet connection and try again.',
      showTryAgain: true,
    };
  }

  // Fallback for generic errors
  return {
    title: 'Authentication Request Failed',
    message: rawError.length < 120 ? rawError : 'Something went wrong. Please try again in a few moments.',
    showTryAgain: true,
  };
}
