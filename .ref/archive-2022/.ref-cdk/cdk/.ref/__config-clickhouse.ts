import * as ec2 from 'aws-cdk-lib/aws-ec2'
import type { Construct } from 'constructs'
import { baseId } from '../configg'

/**
 * Get clickhouse configuration information taking into account which stage is being deployed
 */
export function clickhousePorts(): Record<string, number> {
  return {
    ssh: 22,
    ssl: 8443,
    http: 8123,
    mysql: 3306,
    tcp: 9000,
    tcpSecure: 9440,
    interserver: 9009,
  }
}

export function clickhouseSecurityGroup(context: Construct, id: string, { vpc }: { vpc: ec2.Vpc | ec2.IVpc }): ec2.SecurityGroup {
  const ports = clickhousePorts()
  const securityGroup = new ec2.SecurityGroup(context, baseId(id, `SG`), {
    allowAllOutbound: true,
    vpc,
  })

  Object.keys(ports).forEach((key: string): void => {
    const port = ports[key]

    if (key === 'interserver') {
      securityGroup.addIngressRule(
        securityGroup,
        ec2.Port.tcp(port),
        `CH-IPv4-${key}`,
      )
    }
    else {
      securityGroup.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(port),
        `CH-IPv4-${key}`,
      )
      securityGroup.addIngressRule(
        ec2.Peer.anyIpv6(),
        ec2.Port.tcp(port),
        `CH-IPv6-${key}`,
      )
    }
  })
  return securityGroup
}

function configPriv(): { owner: string, group: string, mode: string } {
  return {
    owner: 'root',
    group: 'root',
    mode: '000644',
  }
}

/**
 * Get clickhouse cloudInit configuration
 */
export function clickhouseCloudInitConfig(cfnRegion: string, cfnInstanceResID: string, cfnStack: string, ec2VolID: string, cwLogGroupName: string): ec2.CloudFormationInit {
  const dataVolDevice = '/dev/sdk'

  /**
   *  AWS CloudFormation CloudInit Options
   *
   *  1. 00_setupCfnHup:
   *     Sets up a systemd service for cfn-hup daemon.
   *     cfn-hup helper is a daemon that detects changes in resource metadata and runs user-specified actions when a change is detected.
   *     This allows you to make configuration updates on your running Amazon EC2 instances through the UpdateStack API action.
   *     URL: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-hup.html
   *
   *     We spin up cfn-init and check for `UpdateEnvironment` CloudFormation Init config set
   *
   *  2. 01_attach_clickhouse_data_volume:
   *     Tries to connect clickhouse data volume between the reboots
   *     - stops clickhouse
   *     - attaches the volume
   *     - starts clickhouse
   *
   *     Volume attachments can't be updated on deploys therefore a command based approach is used
   *     - https://developer.aliyun.com/mirror/npm/package/@aws-cdk/aws-ec2/v/1.19.0#a2c6h.14275010.0.i2.2fcb6899mEKqCy
   *
   *  3. 02_prepare_clickhouse_data_volume:
   *     At the very first time when infrastructure gets created - clickhouse instance tries to attach the data volume to itself.
   *     This volume has no filesystem and data on it, so this step is needed to prepare the volume:
   *     - format and label
   *     - create /etc/fstab mount entrypoint
   *     - mount
   *
   *  4. 03_start_clickhouse:
   *     Starts Clickhouse if it is not started yet
   *
   *  5. 04_config-amazon-cloudwatch-agent:
   *     Here we just populate the configuration of AWS Cloudwatch Agent. It can do many things, but currently we do care only about
   *     being able to stream ClickHouse log file into AWS CloudWatch Logs service.
   *
   *  6. 05_restart_amazon-cloudwatch-agent:
   *     Stops AWS Cloudwatch agent, creates its full configuration file and starts the service again.
   *
   */

  const init = ec2.CloudFormationInit.fromConfigSets({
    configSets: {
      // Applies the configs below in this order
      // default: this config set gets executed during the first boot of the instance
      default: [
        '00_setupCfnHup',
        '01_attach_clickhouse_data_volume',
        '02_prepare_clickhouse_data_volume',
        '03_start_clickhouse',
        '04_config-amazon-cloudwatch-agent',
        '05_restart_amazon-cloudwatch-agent',
      ],
      // updateEnvironment: this config set gets executed by cfn-hup via the hook when changes in resource metadata get detected.
      updateEnvironment: [
        '01_attach_clickhouse_data_volume',
        '03_start_clickhouse',
        '04_config-amazon-cloudwatch-agent',
        '05_restart_amazon-cloudwatch-agent',
      ],
    },
    configs: {
      '00_setupCfnHup': new ec2.InitConfig([
        ec2.InitFile.fromString(
          '/etc/cfn/cfn-hup.conf',
          `[main]\nstack=${cfnStack}\nregion=${cfnRegion}\ninterval=1`,
          configPriv(),
        ),
        ec2.InitFile.fromString(
          '/etc/cfn/hooks.d/amazon-cloudwatch-agent-auto-reloader.conf',
          `[cfn-auto-reloader-hook]
triggers=post.update
path=Resources.${cfnInstanceResID}.Metadata.AWS::CloudFormation::Init
action=/usr/local/bin/cfn-init -v --stack ${cfnStack} --resource ${cfnInstanceResID} --region ${cfnRegion} --configsets "UpdateEnvironment"
runas=root`,
          configPriv(),
        ),

        ec2.InitCommand.shellCommand('systemctl daemon-reload'),
        ec2.InitCommand.shellCommand('systemctl enable cfn-hup.service'),
        ec2.InitCommand.shellCommand('systemctl start cfn-hup.service'),
      ]),
      '01_attach_clickhouse_data_volume': new ec2.InitConfig([
        ec2.InitCommand.shellCommand(
          `[ ! -b $(readlink -f ${dataVolDevice}) ] && /usr/local/sbin/dw-ebsvol-connect.sh ${ec2VolID} ${dataVolDevice} || echo "${dataVolDevice} exists"`,
        ),
      ]),
      '02_prepare_clickhouse_data_volume': new ec2.InitConfig([
        ec2.InitCommand.shellCommand(
          `/usr/local/sbin/aws-dataprep-helper.sh ${dataVolDevice}`,
        ),
      ]),
      '03_start_clickhouse': new ec2.InitConfig([
        ec2.InitCommand.shellCommand('systemctl daemon-reload'),
        ec2.InitCommand.shellCommand(
          'systemctl enable clickhouse-server.service',
        ),
        ec2.InitCommand.shellCommand(
          'systemctl start clickhouse-server.service',
        ),
      ]),
      '04_config-amazon-cloudwatch-agent': new ec2.InitConfig([
        // Creates the configuration file for the agent
        ec2.InitFile.fromString(
          '/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json',
          `{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/clickhouse-server/clickhouse-server.log",
            "auto_removal": false,
            "log_group_name": "${cwLogGroupName}",
            "log_stream_name": "{instance_id}/var/log/clickhouse-server/clickhouse-server.log",
            "timestamp_format": "%Y.%m.%d %H:%M:%S.%f",
            "multi_line_start_pattern": "{timestamp_format}"
          }
        ]
      }
    }
  }
}`,
          configPriv(),
        ),
      ]),
      '05_restart_amazon-cloudwatch-agent': new ec2.InitConfig([
        // Stopping an AWS Cloudwatch Agent
        ec2.InitCommand.argvCommand([
          '/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl',
          '-a',
          'stop',
        ]),
        // Fetching AWS Cloudwatch Agent Configuration
        ec2.InitCommand.argvCommand([
          '/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl',
          '-a',
          'fetch-config',
          '-m',
          'ec2',
          '-c',
          'file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json',
          '-s',
        ]),
      ]),
    },
  })

  return init
}
