OPITON #1: with APNs
{
  id: app_id,
  p8: P8 filetext,
  key_id: key_id (filename has this id attached to it when downloaded from apple),
  team_id: team_id,
  topic: typically your app's bundle id (the namespace tag)
}

OPTION #2: with custom push notification
{
  id: app_id,
  p8: "custom"
  custom_endpoint: URL,
  custom_headers: JSON, optional
}