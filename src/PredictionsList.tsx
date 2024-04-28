import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { supabase } from './supabaseClient';

interface PredictionDetail {
  id: number;
  prediction_text: string;
  prediction_year: number;
  prediction_percentage: number;
  user_email: string;
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
            prediction_text,
            user_email,
            prediction_details (
              prediction_year,
              prediction_percentage
            )
          `)
          .order('id', { ascending: false });

        if (predictionsError) throw predictionsError;

        // Check if predictionsData is not null
        if (predictionsData) {
          // Flatten the data structure for rendering
          let flattenedDetails: PredictionDetail[] = [];
          predictionsData.forEach(prediction => {
            prediction.prediction_details.forEach((detail: any) => {
              flattenedDetails.push({
                id: prediction.id,
                prediction_text: prediction.prediction_text,
                prediction_year: detail.prediction_year,
                prediction_percentage: detail.prediction_percentage,
                user_email: prediction.user_email
              });
            });
          });

          setPredictionDetails(flattenedDetails);
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
            <Th isNumeric>Year</Th>
            <Th isNumeric>Value (%)</Th>
            <Th>User Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {predictionDetails.map((detail) => (
            <Tr key={detail.id}>
              <Td>{detail.prediction_text}</Td>
              <Td isNumeric>{detail.prediction_year}</Td>
              <Td isNumeric>{detail.prediction_percentage}</Td>
              <Td>{detail.user_email}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PredictionsList;
