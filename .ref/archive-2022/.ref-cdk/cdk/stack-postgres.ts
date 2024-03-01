import * as cdk from 'aws-cdk-lib'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import type { Construct } from 'constructs'
import type { CustomStackProps } from './config'
import { baseId, createUrl } from './config'

export class PostgresStack extends cdk.Stack {
  publicIp?: string
  hostname?: string
  port?: string
  url?: string
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    const stage = props.stage

    const vpc = props.vpc

    if (!vpc)
      return

    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'defaultSG',
      vpc.vpcDefaultSecurityGroup,
    )

    const version = rds.PostgresEngineVersion.VER_12_4

    const instance = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({ version }),
      databaseName: 'darwin',
      credentials: rds.Credentials.fromPassword(
        'darwin',
        cdk.SecretValue.secretsManager('POSTGRES_PASSWORD'),
      ),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL,
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      vpc,
      securityGroups: [defaultSecurityGroup],
    })

    instance.connections.allowDefaultPortFromAnyIpv4('allow outside connection')

    const address = instance.instanceEndpoint.socketAddress

    const [hostname, port] = address.split(':')

    this.url = createUrl({
      protocol: 'postgres',
      port,
      hostname,
      username: 'darwin',
      password: 'password',
      options: { version: '12.4' },
    })

    /**
     * Save values to Cloudformation output
     */

    new cdk.CfnOutput(this, 'postgresUrl', { value: this.url })

    new ssm.StringParameter(this, baseId(id, 'postgresUrlParam'), {
      parameterName: `/${stage}/postgres/url`,
      stringValue: this.url,
    })

    new ssm.StringParameter(this, baseId(id, 'postgresHostParam'), {
      parameterName: `/${stage}/postgres/host`,
      stringValue: hostname,
    })

    cdk.Tags.of(this).add('Stack', id)
    cdk.Tags.of(this).add('CreatedBy', 'cdk')
  }
}
