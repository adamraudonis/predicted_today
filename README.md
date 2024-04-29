# Predicted Today

A website to share predictions about the future

## Setup

`npm i`

## Running Locally

`npm start` and open http://localhost:3000

### Schema

prediction_prompt:
id
prediction_text
user_id
unit
is_active
created_at

user_prediction:
id
prediction_prompt_id
user_id
created_at
rationale
is_active

prediction_values:
id
user_prediction:
prediction_prompt_id
year
value
user_id
created_at

ground_truth:
id
name
source_link
description
created_at
user_id

ground_truth_values:
ground_truth_id
year
value
created_at
user_id
