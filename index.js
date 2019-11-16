const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(url);

// subscribeSlack is the main function called by Cloud Functions.
module.exports.subscribeSlack = (pubSubEvent, context) => {
  const build = eventToBuild(pubSubEvent.data);

  // Skip if the current status is not in the status list.
  // Add additional statuses to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return;
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  const repo = build.source.repoSource;
  const source = build.sourceProvenance.resolvedRepoSource;
  const triggerId = build.buildTriggerId;

  const triggerUrl = `https://console.cloud.google.com/cloud-build/triggers/edit/${triggerId}?project=${source.projectId}`;

  const repoUrl = `https://source.cloud.google.com/${source.projectId}/${source.repoName}`;
  const commitUrl = `${repoUrl}/+/${source.commitSha}`;
  const branchUrl = `${repoUrl}/+/${repo.branchName}`;

  const triggerNameAndUrl = `<${triggerUrl}|${build.buildTriggerId}>`;
  const buildIdAndUrl = `<${build.logUrl}|${build.id}>`

  const repoNameAndUrl = `<${repoUrl}|${repo.repoName}>`;
  const repoBranchAndUrl = `<${branchUrl}|${repo.branchName}>`;

  const message = {
    text: `${triggerNameAndUrl} build ${buildIdAndUrl}`,
    mrkdwn: true,
    attachments: [
      {
        title: build.status,
        title_link: build.logUrl,
        text: `Commit to ${repoNameAndUrl} on branch ${repoBranchAndUrl}`
      }
    ]
  };
  return message;
}