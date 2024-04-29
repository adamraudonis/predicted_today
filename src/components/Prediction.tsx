import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { PredictionPrompt, UserPrediction, PredictionValue } from '../types';

type PredictionProps = {
  predictionPrompt: PredictionPrompt;
};

const Prediction: React.FC<PredictionProps> = ({ predictionPrompt }) => {
  const [predictionValues, setPredictionsValues] = useState<PredictionValue[]>(
    []
  );
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  //   const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('prediction_values')
        .select('*')
        .eq('prediction_prompt_id', predictionPrompt.id);
      if (error) throw error;
      setPredictionsValues(data);
    };
    const fetchData2 = async () => {
      const { data, error } = await supabase
        .from('user_prediction')
        .select('*')
        .eq('is_active', true)
        .eq('prediction_prompt_id', predictionPrompt.id);
      if (error) throw error;
      setUserPredictions(data);
    };

    fetchData();
    fetchData2();
  }, [predictionPrompt.id]);

  return (
    <div>
      <h1>Prediction</h1>
      <p>{predictionPrompt.prediction_text}</p>
      <h3>Values</h3>
      <ul>
        {predictionValues.map((predictionValue) => (
          <li key={predictionValue.id}>
            {predictionValue.year}: {predictionValue.value}
          </li>
        ))}
      </ul>
      <h3>Users</h3>
      <ul>
        {userPredictions.map((userPrediction) => (
          <li key={userPrediction.id}>{userPrediction.user_id} </li>
        ))}
      </ul>
      <Button
        colorScheme="red"
        variant="solid"
        onClick={async () => {
          const { data, error } = await supabase
            .from('prediction_prompt')
            .update({ is_active: false })
            .eq('id', predictionPrompt.id);

          if (error) {
            console.error('Error updating prediction:', error);
          } else {
            console.log('Prediction updated successfully:', data);
          }
        }}
      >
        X
      </Button>
      <Button
        colorScheme="blue"
        variant="solid"
        onClick={() => {
          window.location.href = '/add_prediction?id=' + predictionPrompt.id;
        }}
      >
        Make Prediction
      </Button>
    </div>
  );
};

export default Prediction;
