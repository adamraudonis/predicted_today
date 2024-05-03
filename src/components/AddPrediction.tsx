import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { CloseIcon } from '@chakra-ui/icons';
import LineGraph from './LineGraph';

interface PredictionEntry {
  year: string;
  value: string;
}

type AddPredictionProps = {
  session: any;
};

const AddPrediction: React.FC<AddPredictionProps> = () => {
  // const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<[number, number][]>([]);
  const graph = useRef<LineGraph | null>(null);

  // Callback ref to handle SVG initialization immediately when the element is mounted
  const setSvgRef = (node: SVGSVGElement | null) => {
    if (node && !graph.current) {
      // Check if node exists and graph is not already initialized
      console.log('Initializing graph');
      graph.current = new LineGraph();
      graph.current.initialize(node);
      graph.current.updatePoints = () => {
        console.log('inside update points');
        if (graph.current) {
          console.log(' graph.current.getPoints()', graph.current.getPoints());
          setPoints([...graph.current.getPoints().sort((a, b) => a[0] - b[0])]); // Update React state when D3 state changes
        }
      };
    }
  };

  console.log('inside should re render', points);

  useEffect(() => {
    console.log('the points changed');
    // if (svgRef.current) {
    //   console.log('initializing graph');
    //   graph.current = new LineGraph();
    //   graph.current.initialize(svgRef.current);
    //   graph.current.update = () => {
    //     // Override update method to include state setting
    //     if (graph.current) {
    //       setPoints(graph.current.getPoints()); // Update React state when D3 state changes
    //     }
    //   };
    // }
  }, [points]);

  // TODO: Get the url param for example:
  // http://localhost:3000/add_prediction?id=6
  const urlParams = new URLSearchParams(window.location.search);
  const { id } = Object.fromEntries(urlParams.entries());
  const predictionPromptId = id;

  const [predictions, setPredictions] = useState<PredictionEntry[]>([
    { year: '', value: '' },
  ]);
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
    console.log('inside submit');
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prediction.');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_prediction')
        .insert([
          {
            user_id: user.id,
            prediction_prompt_id: predictionPromptId,
            is_active: true,
          },
        ])
        .select();
      if (error) throw error;
      console.log(data);
      const user_prediction_id = data[0].id;

      await supabase.from('prediction_values').insert(
        predictions.map((prediction) => ({
          user_prediction_id: user_prediction_id,
          prediction_prompt_id: predictionPromptId,
          year: prediction.year,
          value: prediction.value,
          user_id: user.id,
        }))
      );
      if (error) throw error;
      alert('Prediction submitted successfully.');
      setPredictions([{ year: '', value: '' }]);
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addPredictionEntry = () => {
    setPredictions([...predictions, { year: '', value: '' }]);
  };

  const updatePredictionEntry = (
    index: number,
    field: keyof PredictionEntry,
    value: string
  ) => {
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
      <Box>
        <svg ref={setSvgRef}></svg>
        <table>
          <thead>
            <tr>
              <th>X (Year)</th>
              <th>Y (Value)</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index}>
                <td>{point[0]}</td>
                <td>{point[1].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <form onSubmit={handlePredictionSubmit}>
        <VStack spacing={4}>
          {predictions.map((prediction, index) => (
            <HStack key={index}>
              <FormControl id={`predictionYear_${index}`} isRequired>
                <FormLabel>Year</FormLabel>
                <Input
                  type="number"
                  value={prediction.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updatePredictionEntry(index, 'year', e.target.value)
                  }
                />
              </FormControl>
              <FormControl id={`predictionValue_${index}`} isRequired>
                <FormLabel>Value</FormLabel>
                <Input
                  type="number"
                  value={prediction.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updatePredictionEntry(index, 'value', e.target.value)
                  }
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
        {error && (
          <Box color="red.500" mt={2}>
            {error}
          </Box>
        )}
        <Button mt={4} colorScheme="teal" isLoading={loading} type="submit">
          Submit Predictions
        </Button>
      </form>
    </Box>
  );
};

export default AddPrediction;
