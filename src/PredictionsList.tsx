import React, { useState, useEffect } from 'react';
import { Box, List, ListItem } from '@chakra-ui/react';
import { supabase } from './supabaseClient';

interface Prediction {
  id: number;
  prediction_text: string;
  prediction_year: number;
  user_id: string;
}

const PredictionsList: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*');

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

  return (
    <Box>
      <List spacing={3}>
        {predictions.map((prediction) => (
          <ListItem key={prediction.id}>
            {prediction.prediction_text} - {prediction.prediction_year}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PredictionsList;
