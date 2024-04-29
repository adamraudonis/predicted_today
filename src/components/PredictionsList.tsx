import React, { useState, useEffect } from 'react';
import { Box, List, ListItem } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import Prediction from './Prediction';
import { PredictionPrompt } from '../types';

const PredictionsList: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase
          .from('prediction_prompt')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        setPredictions(data);
      } catch (error: any) {
        setError(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  if (predictions.length === 0) return <Box>No predictions found.</Box>;

  return (
    <Box>
      <List spacing={3}>
        {predictions.map((prediction) => (
          <ListItem key={prediction.id}>
            <Prediction predictionPrompt={prediction}></Prediction>
            {/* {prediction.prediction_text} By {prediction.user_id} */}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PredictionsList;
