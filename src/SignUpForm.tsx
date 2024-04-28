import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { signUp, signIn } from './supabaseClient';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'}...`); // Added console log for debugging

    try {
      const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
      if (error) throw error;
      const successMessage = isSignUp
        ? 'Sign up successful. Please check your email for a confirmation link.'
        : 'Sign in successful. Welcome back!';
      alert(successMessage);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    console.log('Toggled form, isSignUp:', !isSignUp); // Existing console log to check the state
    setError(''); // Clear any existing errors when toggling the form
  };

  return (
    <Box p={4}>
      <form onSubmit={handleAuth}>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </FormControl>
        {error && <Box color="red.500" mt={2}>{error}</Box>}
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={loading}
          type="submit"
        >
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        <Box mt={4}>
          <Button color="teal.500" variant="link" onClick={toggleForm}>
            {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SignUpForm;
