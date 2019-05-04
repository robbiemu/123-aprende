{
  apps: {
    model_id:["app_id",...]
    },
  predictions: {
    model_id: {
      transaction_id: the current transaction, given to the model executor,
      predictions:{
        app_id:[[NANOSECOND_TIMESTAMP, METRIC,Z-SCORE]], ...
      },
      forecast: a zipped, base64 encoded representation of timeseries forecase data (see timeseries.d)
    }
  },
  transaction_id: the current transaction, given to the model executor,
}
