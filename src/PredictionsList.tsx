import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { supabase } from './supabaseClient';

interface PredictionDetail {
  id: number;
  prediction_text: string;
}

const PredictionsList: React.FC = () => {
  const [predictionDetails, setPredictionDetails] = useState<PredictionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictionDetails = async () => {
      try {
        let { data: predictionsData, error: predictionsError } = await supabase
          .from('predictions')
          .select(`
            id,
            prediction_text
          `)
          .order('id', { ascending: false });

        if (predictionsError) throw predictionsError;

        // Check if predictionsData is not null
        if (predictionsData) {
          setPredictionDetails(predictionsData);
        }
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

    fetchPredictionDetails();
  }, []);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Prediction Text</Th>
          </Tr>
        </Thead>
        <Tbody>
          {predictionDetails.map((detail) => (
            <Tr key={detail.id}>
              <Td>{detail.prediction_text}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PredictionsList;
