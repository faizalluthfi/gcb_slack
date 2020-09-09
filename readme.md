# Google Cloud Functions App to Send Cloud Build Status to Slack Webhook

## Feature
This app support cloud build trigerred by cloud
platform or cloud repository push.

## Deploy
There are two ways to deploy this app, using gcloud or
cloud build.

### Deploy using gcloud
To deploy using gcloud, follow the following steps:

1. Clone the repository
    ```
    git clone git@github.com:faizalluthfi/gcb_slack.git
    cd gcb_slack
    ```
2. Run:
    ```
    gcloud functions deploy subscribeSlack \
        --trigger-topic cloud-builds \
        --runtime nodejs10 \
        --set-env-vars \
            SLACK_WEBHOOK_URL=$_SLACK_WEBHOOK_URL
    ```

### Deploy using cloud build
To use google cloud build to deploy this app to cloud
function, follow the following steps:

1. Clone the repository
    ```
    git clone git@github.com:faizalluthfi/gcb_slack.git
    cd gcb_slack
    ```
2. Create google cloud repository
3. Add google cloud cloud repository url as remote push
    ```
    git remote set-url --add --push origin git@github.com:faizalluthfi/gcb_slack.git
    git remote set-url --add --push origin $GOOGLE_CLOUD_PLATFORM_REPOSITORY_URL
    ```
4. Add the following roles to cloud build service
   account:
    - "Cloud Functions Admin" to deploy cloud function
    - "Service Account User" to access google cloud
      function cloud storage
5. Create google cloud build trigger to cloud repository
6. Push

    ```
    git push
    ```