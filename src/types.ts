export type PredictionPrompt = {
    id: number;
    prediction_text: string;
    user_id: string;
};

export type PredictionValue = {
    id: number;
    prediction_prompt_id: number;
    year: number;
    value: number;
};

export type UserPrediction = {
    id: number;
    user_id: string;
    prediction_prompt_id: number;
    is_active: boolean;
};