import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'
import type { CustomStackProps } from '../config'
import { awsEnv, baseId, createUrl } from '../config'

import {
  clickhousePorts,
  clickhouseSecurityGroup,
} from './__config-clickhousese'

export class ClickhouseStack extends cdk.Stack {
  publicIp?: string
  hostname?: string
  port?: string
  url?: string
  protocol?: string
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    const stage = props.stage
    const { account } = awsEnv()

    const vpc = props.vpc

    const ports = clickhousePorts()

    if (!vpc)
      return

    const availabilityZone = this.availabilityZones[0]

    /**
     * Get the AMI (this is the latest AMI which we build as a separate step)
     */
    const machineImage = new ec2.LookupMachineImage({
      name: 'darwin/images/clickhouse-linux-*',
      owners: [account],
      filters: {
        'root-device-type': ['ebs'],
        'virtualization-type': ['hvm'],
      },
    })

    const volume = ec2.Volume.fromVolumeAttributes(
      this,
      baseId(id, 'PrimaryVolume'),
      { volumeId: 'vol-0e6827a2090d84094', availabilityZone },
    )

    /**
     * Create security group
     */

    const securityGroup = clickhouseSecurityGroup(this, id, { vpc })

    /**
     * Create EC2 machine
     */
    const chInstance = new ec2.Instance(this, baseId(id, 'Instance'), {
      availabilityZone,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.LARGE,
      ),
      instanceName: `clickhouse/${stage}`,
      vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
      machineImage,
      securityGroup,
      keyName: 'darwinssh', // has a manually created key/pair associated
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(10),
        },
      ],
    })

    volume.grantAttachVolumeByResourceTag(chInstance.grantPrincipal, [
      chInstance,
    ])

    const targetDevice = '/dev/sdk'

    chInstance.userData.addCommands(
      `TOKEN='curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"'`,
      `INSTANCE_ID='curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/instance-id'`,
      // Attach the volume to /dev/xvdz
      `aws --region ${
        cdk.Stack.of(this).region
      } ec2 attach-volume --volume-id ${
        volume.volumeId
      } --instance-id $INSTANCE_ID --device ${targetDevice}`,
      // Wait until the volume has attached
      `while ! test -e ${targetDevice}; do sleep 1; done`,
      // The volume will now be mounted. You may have to add additional code to format the volume if it has not been prepared.
    )

    this.publicIp = chInstance.instancePublicIp

    this.protocol = 'http'
    this.port = String(ports[this.protocol])
    this.hostname = this.publicIp
    this.url = createUrl({
      protocol: this.protocol,
      port: this.port,
      hostname: this.hostname,
      username: 'darwin',
      password: 'password', // not actual password: passed as CLICKHOUSE_PASSWORD
    })

    /**
     * Save values to Cloudformation output
     */
    new cdk.CfnOutput(this, 'clickhousePort', {
      value: this.port,
    })

    new cdk.CfnOutput(this, 'clickhouseEndpoint', {
      value: this.hostname,
    })

    new cdk.CfnOutput(this, 'clickhouseUrl', {
      value: this.url,
    })

    new cdk.CfnOutput(this, 'clickhouseIp', {
      value: this.publicIp,
      description: 'The Public IP address of ClickHouse instance',
    })

    /**
     * Save values to SSM Parameters
     */
    new ssm.StringParameter(this, 'clickhouseUrlParam', {
      parameterName: `/${stage}/clickhouse/url`,
      stringValue: this.url,
    })

    cdk.Tags.of(this).add('Stack', id)
    cdk.Tags.of(this).add('CreatedBy', 'cdk')
  }
}
