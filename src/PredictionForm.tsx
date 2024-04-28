import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import { CloseIcon } from '@chakra-ui/icons';

interface PredictionDetail {
  year: string;
  percentage: string;
}

const PredictionForm: React.FC = () => {
  const [predictionText, setPredictionText] = useState('');
  const [predictionDetails, setPredictionDetails] = useState<PredictionDetail[]>([{ year: '', percentage: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [user, setUser] = useState<null | { id: string, email: string }>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setUser(null);
      }
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
      // Assuming a 'prediction_details' table exists with a foreign key to 'predictions'
      const { data: predictionData, error: predictionError } = await supabase
        .from('predictions')
        .insert({
          prediction_text: predictionText,
          user_id: user.id,
          user_email: user.email
        });

      if (predictionError) throw predictionError;

      // Check if predictionData is not null and has at least one record
      if (!predictionData || (predictionData as any[]).length === 0) {
        throw new Error('Failed to insert prediction data.');
      }

      const predictionId = (predictionData as any[])[0].id; // Type assertion to any[] to satisfy TypeScript

      const { error: detailsError } = await supabase
        .from('prediction_details')
        .insert(
          predictionDetails.map(detail => ({
            prediction_id: predictionId,
            prediction_year: detail.year,
            prediction_percentage: detail.percentage
          }))
        );

      if (detailsError) throw detailsError;

      alert('Prediction submitted successfully.');
      setPredictionDetails([{ year: '', percentage: '' }]);
      setPredictionText('');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addPredictionDetail = () => {
    setPredictionDetails([...predictionDetails, { year: '', percentage: '' }]);
  };

  const updatePredictionDetail = (index: number, field: keyof PredictionDetail, value: string) => {
    const newDetails = [...predictionDetails];
    newDetails[index][field] = value;
    setPredictionDetails(newDetails);
  };

  const removePredictionDetail = (index: number) => {
    const newDetails = [...predictionDetails];
    newDetails.splice(index, 1);
    setPredictionDetails(newDetails);
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
          <FormControl isRequired>
            <FormLabel>Prediction Text</FormLabel>
            <Input
              type="text"
              value={predictionText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPredictionText(e.target.value)}
            />
          </FormControl>
          {predictionDetails.map((detail, index) => (
            <HStack key={index}>
              <FormControl id={`predictionYear_${index}`} isRequired>
                <FormLabel>Year</FormLabel>
                <Input
                  type="number"
                  value={detail.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePredictionDetail(index, 'year', e.target.value)}
                />
              </FormControl>
              <FormControl id={`predictionPercentage_${index}`} isRequired>
                <FormLabel>Percentage</FormLabel>
                <Input
                  type="number"
                  value={detail.percentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePredictionDetail(index, 'percentage', e.target.value)}
                />
              </FormControl>
              <IconButton
                aria-label="Remove prediction detail"
                icon={<CloseIcon />}
                onClick={() => removePredictionDetail(index)}
              />
            </HStack>
          ))}
          <Button onClick={addPredictionDetail}>Add another year and percentage</Button>
        </VStack>
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
