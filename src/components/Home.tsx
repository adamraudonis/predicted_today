import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import PredictionsList from './PredictionsList';
import Header from './Header';
import SignUpForm from './SignUpForm';
import OAuth from './OAuth';

type HomeProps = {
  session: any;
};

const Home: React.FC<HomeProps> = ({ session }) => {
  return (
    <Box>
      {/* TODO: Move header to app.tsx */}
      <Header />
      <SignUpForm />
      <OAuth session={session} />
      <PredictionsList />
      <Button
        colorScheme="blue"
        variant="solid"
        onClick={() => {
          window.location.href = '/new_prediction';
        }}
      >
        New Prediction Prompt
      </Button>
    </Box>
  );
};

export default Home;
