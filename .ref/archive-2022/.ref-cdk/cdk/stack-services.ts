import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as logs from 'aws-cdk-lib/aws-logs'
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets'
import type { Construct } from 'constructs'
import type {
  CustomStackProps,
} from './config'
import {
  baseId,
  getStageDomain,
  nodeServiceConfig,
  serviceSecretConfig,
} from './config'

/**
 * The resources stack for Node Services
 */
export class ServiceStack extends cdk.Stack {
  urls: { name: string, output: cdk.CfnOutput }[]

  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props)

    // Map of output urls from public tasks
    this.urls = []

    if (!props.vpc)
      return

    const vpc = props.vpc
    const stage = props.stage

    /**
     * Gets domain associated with stage
     */
    const { certificateArn, domainName, hostedZoneId } = getStageDomain()
    /**
     * Get an existing SSL cert from ARN
     */
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      baseId(stage, 'ImportedCertificate'),
      certificateArn,
    )
    /**
     * Get the AWS Route53 zone for stage domain
     */
    const domainZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      baseId(stage, `HostedZone`),
      { hostedZoneId, zoneName: domainName },
    )
    /**
     * Set up env vars
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { valueForStringParameter } = ssm.StringParameter

    const environment: Record<string, string> = {
      NODE_ENV: 'production',
      STAGE_ENV: stage,
      DEPLOY_ENV: 'aws',
      CLICKHOUSE_URL:
        'http://darwin:password@ec2-52-206-13-6.compute-1.amazonaws.com:8123', // valueForStringParameter(this, `/${stage}/clickhouse/url`),
      // CLICKHOUSE_2_URL:
      // "https://admin:password@darwin-primary.fiction.altinity.cloud:8443",
      REDIS_URL: valueForStringParameter(this, `/${stage}/redis/url`),
      POSTGRES_URL: valueForStringParameter(this, `/${stage}/postgres/url`),
      AWS_S3_BUCKET_SCRIPT: 'kaption-prod-script',
      AWS_S3_BUCKET_SESSION: 'darwin-prod-session',
      AWS_S3_BUCKET_REGION: this.region,
      AWS_ACCESS_KEY: 'AKIAWJ7YC2BYUVXU47M6',
      KAPTION_API_DOMAIN: domainName,

      SCRIPT_DISTRIBUTION_ID: valueForStringParameter(
        this,
        `/${stage}/script/distributionId`,
      ),
    }

    const secrets: Record<string, ecs.Secret> = {}
    const secretArns: string[] = []

    serviceSecretConfig().forEach(({ name, arn }) => {
      secrets[name] = ecs.Secret.fromSecretsManager(
        secretsmanager.Secret.fromSecretCompleteArn(
          this,
          `Secret-${name}`,
          arn,
        ),
      )
      secretArns.push(arn)
    })

    new cdk.CfnOutput(this, `serviceEnvironment`, {
      value: JSON.stringify(environment),
    })
    new cdk.CfnOutput(this, `serviceSecrets`, {
      value: JSON.stringify(secrets),
    })

    /**
     * Build an image with the entire monorepo to work with
     */
    const dockerImage = new DockerImageAsset(this, baseId('DockerImage'), {
      directory: '.',
      file: `./docker/ci.Dockerfile`,
    })

    const image = ecs.ContainerImage.fromDockerImageAsset(dockerImage)

    const cluster = new ecs.Cluster(this, baseId('KaptionCluster'), {
      containerInsights: true,
      vpc,
    })

    /**
     * Gets the default VPC security group
     */
    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'defaultSG',
      vpc.vpcDefaultSecurityGroup,
    )

    const containerConfigs = nodeServiceConfig()

    containerConfigs.forEach(
      ({ name, port, subDomain, desiredCount, cpu, memoryLimitMiB }) => {
        const taskDefinition = new ecs.FargateTaskDefinition(
          this,
          baseId(name, `TaskDef`),
          {
            cpu: cpu ?? 512,
            memoryLimitMiB: memoryLimitMiB ?? 1024,
          },
        )

        // https://github.com/aws/aws-cdk/issues/3529#issuecomment-518240418
        taskDefinition.obtainExecutionRole().addToPrincipalPolicy(
          new iam.PolicyStatement({
            actions: ['ssm:GetParameters'],
            resources: secretArns,
          }),
        )

        const logGroup = new logs.LogGroup(this, baseId(name, 'awsLogGroup'), {
          logGroupName: `/${stage}/aws/ecs/service-${name}`,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          retention: logs.RetentionDays.TWO_WEEKS,
        })

        const logging = new ecs.AwsLogDriver({
          streamPrefix: 'service',
          logGroup,
        })

        const container = taskDefinition.addContainer(name, {
          image,
          command: [`--SERVICE=@kaption/${name}`],
          environment,
          secrets,
          logging,
        })

        container.addPortMappings(
          { containerPort: port },
          { containerPort: port - 20 },
        )

        let publicUrlSettings:
          | undefined
          | {
            domainName: string
            domainZone: route53.IHostedZone
            certificate: acm.ICertificate
            assignPublicIp: true
            publicLoadBalancer: true
            openListener: true
            redirectHTTP: true
          }

        if (subDomain) {
          const subDomainName = `${subDomain}.${domainName}`

          this.urls.push({
            name,
            output: new cdk.CfnOutput(this, `${name}Url`, {
              value: `https://${subDomainName}`,
            }),
          })

          publicUrlSettings = {
            domainName: subDomainName,
            domainZone,
            certificate,
            assignPublicIp: true,
            publicLoadBalancer: true,
            openListener: true,
            redirectHTTP: true,
          }
        }

        const fargateService
          = new ecsPatterns.ApplicationLoadBalancedFargateService(
            this,
            baseId(name),
            {
              cluster,
              taskDefinition,
              securityGroups: [defaultSecurityGroup],
              desiredCount: desiredCount || 1,
              ...publicUrlSettings,
            },
          )

        fargateService.loadBalancer.addSecurityGroup(defaultSecurityGroup)

        // Setup AutoScaling policy
        const scaling = fargateService.service.autoScaleTaskCount({
          maxCapacity: 12,
        })
        scaling.scaleOnCpuUtilization('CpuScaling', {
          targetUtilizationPercent: 50,
          scaleInCooldown: cdk.Duration.seconds(60),
          scaleOutCooldown: cdk.Duration.seconds(60),
        })

        scaling.scaleOnRequestCount('RequestScaling', {
          requestsPerTarget: 10_000,
          targetGroup: fargateService.targetGroup,
        })
      },
    )

    cdk.Tags.of(this).add('Stack', id)
    cdk.Tags.of(this).add('CreatedBy', 'cdk')
  }
}
