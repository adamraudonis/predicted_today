import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { supabase } from './supabaseClient';

const PredictionForm: React.FC = () => {
  const [predictionText, setPredictionText] = useState('');
  const [predictionYear, setPredictionYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredictionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('predictions')
        .insert([{ prediction_text: predictionText, prediction_year: predictionYear }]);
      if (error) throw error;
      alert('Prediction submitted successfully.');
      setPredictionText('');
      setPredictionYear('');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handlePredictionSubmit}>
        <FormControl id="predictionText" isRequired>
          <FormLabel>Prediction</FormLabel>
          <Input
            type="text"
            value={predictionText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPredictionText(e.target.value)}
          />
        </FormControl>
        <FormControl id="predictionYear" isRequired mt={4}>
          <FormLabel>Year</FormLabel>
          <Input
            type="number"
            value={predictionYear}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPredictionYear(e.target.value)}
          />
        </FormControl>
        {error && <Box color="red.500" mt={2}>{error}</Box>}
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={loading}
          type="submit"
        >
          Submit Prediction
        </Button>
      </form>
    </Box>
  );
};

export default PredictionForm;
