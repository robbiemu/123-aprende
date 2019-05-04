# Using Custom models

In the case that you would like to make use of a custom forecasting and predicting method, the design of BBN allows this. See the models.md specification file for the requisite configuration. This document instead will give an overview of this process.

## Model selection

When a user's data is updated, such as on a location change or a metric submission, the details are collected into a singular ledger. The ledger is then processed on the backend -- for each metric, the associated app is specified in the ledger. The app's model details, which you configured either initially or at some later point, are read. If you have not configured a model, the default model is used. If a custom model is specificied, it is chanrged with processing the entire ledger, returning a valid prediction response (see predictions.md).

We can host the model files for you, and you are not restricted to using an hdq5 (keras/tensorflow) model, but one is used as the default model. If your app reports multiple app_ids or you are using a single model for multiple apps together, the user's ledger is processed once for each app in the batch. Your app must respond with forecasts for the apps that it is responsible for.

### notes

Models are expected to return without predictions in the case that there is insufficient data (the default model requires 2 weeks of recent data to begin predicting).

Model execution must complete inside of 10 minutes.
