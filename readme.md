# Google Cloud Functions App to Send Cloud Build Status to Slack Webhook

## Features
This app support cloud build trigerred by cloud platform or cloud repository push.

## Deploy
There are two ways to deploy this app, using gcloud or cloud build.

### Deploy using gcloud

```
gcloud functions deploy subscribeSlack \
    --trigger-topic cloud-builds \
    --runtime nodejs10 \
    --set-env-vars \
        SLACK_WEBHOOK_URL=$_SLACK_WEBHOOK_URL
```

### Deploy using cloud build

To use google cloud build to deploy this app to cloud function,
the app should be pushed to google cloud repository and
cloud build service account should have the following roles:
- "Cloud Functions Admin" to deploy cloud function
- "Service Account User" to access google cloud function cloud storage