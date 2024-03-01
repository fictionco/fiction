import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

import * as ssm from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'
import type { CustomStackProps } from './config'
import { baseId } from './config'

export class VpcStack extends cdk.Stack {
  vpc: ec2.Vpc
  vpcIdOutput: cdk.CfnOutput
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    /**
     * This is the primary VPC that is shared between all services
     * Only 2 AZs are used to save on costs, more can be added later
     */
    this.vpc = new ec2.Vpc(this, baseId(props.stage, 'SharedVpc'), {
      maxAzs: 2,
      natGateways: 1,
    })

    this.vpcIdOutput = new cdk.CfnOutput(this, 'vpc-id', {
      value: this.vpc.vpcId,
    })

    /**
     * Save values to SSM Parameters
     */
    new ssm.StringParameter(this, 'vpcId', {
      parameterName: `/${props.stage}/vpc/id`,
      stringValue: this.vpc.vpcId,
    })
    new ssm.StringParameter(this, 'vpcSg', {
      parameterName: `/${props.stage}/vpc/sg`,
      stringValue: this.vpc.vpcDefaultSecurityGroup,
    })

    // create tags
    cdk.Tags.of(this).add('Stack', id)
    cdk.Tags.of(this).add('CreatedBy', 'cdk')
  }
}
