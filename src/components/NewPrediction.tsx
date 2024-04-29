import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  // Text,
  // VStack,
  // HStack,
  // IconButton,
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
// import { CloseIcon } from '@chakra-ui/icons';

// interface PredictionEntry {
//   year: string;
//   percentage: string;
// }

type NewPredictionProps = {
  session: any;
};

const NewPrediction: React.FC<NewPredictionProps> = () => {
  // const [predictions, setPredictions] = useState<PredictionEntry[]>([
  //   { year: '', percentage: '' },
  // ]);
  const [prediction_text, setPredictionText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [user, setUser] = useState<null | { id: string }>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handlePredictionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prediction.');
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.from('prediction_prompt').insert({
        user_id: user.id,
        prediction_text: prediction_text,
        unit: 'none',
        is_active: true,
      });

      if (error) throw error;
      console.log('Prediction submitted successfully.');
      setPredictionText(prediction_text);
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
    // TODO: Go back to the predictions list
  };

  // TODO: Re-enable auth
  // if (!user) {
  //   return (
  //     <Box p={4}>
  //       <Text>You must be logged in to submit a prediction.</Text>
  //     </Box>
  //   );
  // }

  return (
    <Box p={4}>
      <form onSubmit={handlePredictionSubmit}>
        <FormControl id={'prediction_text'} isRequired>
          <FormLabel>Prediction Prompt</FormLabel>
          <Textarea
            value={prediction_text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setPredictionText(e.target.value)
            }
          />
        </FormControl>
        {error && (
          <Box color="red.500" mt={2}>
            {error}
          </Box>
        )}
        <Button mt={4} colorScheme="teal" isLoading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default NewPrediction;
