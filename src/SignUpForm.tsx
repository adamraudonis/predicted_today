import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { signUp } from './supabaseClient';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await signUp(email, password);
      if (error) throw error;
      alert('Sign up successful. Please check your email for a confirmation link.');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSignUp}>
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
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUpForm;
