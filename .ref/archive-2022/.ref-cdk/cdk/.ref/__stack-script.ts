import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import type { Construct } from 'constructs'
import type { CustomStackProps } from '../config'
import { baseId } from '../config'

export class StaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    const stage = props.stage

    const distribution = cloudfront.Distribution.fromDistributionAttributes(
      this,
      baseId(stage, 'script', 'Distribution'),
      {
        distributionId: 'E1PIUW3335II91',
        domainName: 'd3plvfc3cmo2z2.cloudfront.net',
      },
    )

    const scriptBucket = s3.Bucket.fromBucketArn(
      this,
      baseId(stage, 'script', 'bucket'),
      'arn:aws:s3:::darwin-prod-script',
    )

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./@packages/tracker/dist')],
      destinationBucket: scriptBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: false,
    })
  }
}
