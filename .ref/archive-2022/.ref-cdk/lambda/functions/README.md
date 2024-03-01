# Lambda

This readme documents how to deploy them and best practices.

## Install AWS SAM CLI

This is managed by AWS Sam CLI. Instructions on installing are here:

[Install Mac](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)

To upgrade:

```bash
brew upgrade aws-sam-cli
```

## To create and deploy the function

Just run the script in `package.json`...

```bash
yarn deploy-lambda
```

This will build and deploy the function via CloudFormation.

## Important

When the lambda function deploys it currently changes the trigger to a testing/boiler plate API endpoint. This should be a CloudFront lambda@edge trigger.

It is important to immediately go to AWS console and switch this to a lambda@edge trigger as deploying the function changes the trigger.

## ToDo

The trigger should be configured in this package via CloudFormation so that the trigger is associated on deploy and correctly handled. This is a bit challenging however due to the complexities of working with CloudFormation and testing that it works correctly.

[Connecting to CloudFront](https://aws.amazon.com/blogs/networking-and-content-delivery/managing-lambdaedge-and-cloudfront-deployments-by-using-a-ci-cd-pipeline/)

## Notes on Lambda Creation

### Headers

The headers object requires a key and the actual header, the key must be the lowercase version of the actual header or you get this error:

> The name of the header must be in lowercase and must match the value of key except for case. We can't connect to the server for this app or website at this time. There might be too much traffic or a configuration error. Try again later, or contact the app or website owner.
