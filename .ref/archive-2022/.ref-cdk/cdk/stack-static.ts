import * as cdk from 'aws-cdk-lib'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import type { Construct } from 'constructs'
import type { CustomStackProps } from './config'
import { baseId } from './config'

export class StaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    const stage = props.stage

    const instance = s3.Bucket.fromBucketArn(
      this,
      baseId(stage, 'script', 'bucket'),
      `arn:aws:s3:::kaption-${stage}-script`,
    )

    const distribution = cloudfront.Distribution.fromDistributionAttributes(
      this,
      'ImportedDist',
      {
        distributionId: 'E3TOGKDD6GZ9S0',
        domainName: 'd12dg1r1rll4zi.cloudfront.net',
      },
    )

    new ssm.StringParameter(this, baseId(stage, 'ScriptDistributionId'), {
      parameterName: `/${stage}/script/distributionId`,
      stringValue: distribution.distributionId,
    })

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./@kaption/client-tag/dist')],
      destinationBucket: instance,
      distribution,
      distributionPaths: ['/*'],
      prune: false,
    })
  }
}
