import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import { CloseIcon } from '@chakra-ui/icons';

interface PredictionEntry {
  year: string;
  percentage: string;
}

const PredictionForm: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionEntry[]>([{ year: '', percentage: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [user, setUser] = useState<null | { id: string }>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handlePredictionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prediction.');
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase
        .from('predictions')
        .insert(predictions.map(prediction => ({
          prediction_year: prediction.year,
          prediction_percentage: prediction.percentage,
          user_id: user.id
        })));
      if (error) throw error;
      alert('Prediction submitted successfully.');
      setPredictions([{ year: '', percentage: '' }]);
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addPredictionEntry = () => {
    setPredictions([...predictions, { year: '', percentage: '' }]);
  };

  const updatePredictionEntry = (index: number, field: keyof PredictionEntry, value: string) => {
    const newPredictions = [...predictions];
    newPredictions[index][field] = value;
    setPredictions(newPredictions);
  };

  const removePredictionEntry = (index: number) => {
    const newPredictions = [...predictions];
    newPredictions.splice(index, 1);
    setPredictions(newPredictions);
  };

  if (!user) {
    return (
      <Box p={4}>
        <Text>You must be logged in to submit a prediction.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <form onSubmit={handlePredictionSubmit}>
        <VStack spacing={4}>
          {predictions.map((prediction, index) => (
            <HStack key={index}>
              <FormControl id={`predictionYear_${index}`} isRequired>
                <FormLabel>Year</FormLabel>
                <Input
                  type="number"
                  value={prediction.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePredictionEntry(index, 'year', e.target.value)}
                />
              </FormControl>
              <FormControl id={`predictionPercentage_${index}`} isRequired>
                <FormLabel>Percentage</FormLabel>
                <Input
                  type="number"
                  value={prediction.percentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePredictionEntry(index, 'percentage', e.target.value)}
                />
              </FormControl>
              <IconButton
                aria-label="Remove prediction"
                icon={<CloseIcon />}
                onClick={() => removePredictionEntry(index)}
              />
            </HStack>
          ))}
          <Button onClick={addPredictionEntry}>Add another year</Button>
        </VStack>
        {error && <Box color="red.500" mt={2}>{error}</Box>}
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={loading}
          type="submit"
        >
          Submit Predictions
        </Button>
      </form>
    </Box>
  );
};

export default PredictionForm;
