import * as cdk from 'aws-cdk-lib'
import * as elasticache from 'aws-cdk-lib/aws-elasticache'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'
import type { CustomStackProps } from './config'
import { baseId, createUrl } from './config'

export class RedisStack extends cdk.Stack {
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

    const cacheSubnetGroupName = `${stage}-redisSubnets`
    const subnetGroup = new elasticache.CfnSubnetGroup(
      this,
      baseId(stage, 'RedisClusterPrivateSubnetGroup'),
      {
        cacheSubnetGroupName,
        subnetIds: vpc.privateSubnets.map(({ subnetId }) => subnetId), // TODO make private
        description: 'redis subnet group',
      },
    )

    const cacheNodeType = stage === 'prod' ? 'cache.t3.small' : 'cache.t3.micro'

    /**
     * Custom settings for Redis
     * This is not very well supported by CDK so `darwin-redis-config` param group was
     * added manually
     *
     * Below we can generate a parameter group but can't figure out the name or value to provide to the cluster
     */
    // Create the param group with CDK, could not figure out how to get the generated name
    // const paramGroup = new elasticache.CfnParameterGroup(
    //   this,
    //   "notifyKeyspace",
    //   {
    //     cacheParameterGroupFamily: "redis6.x",
    //     description: "enable keyspace events",
    //     properties: { "notify-keyspace-events": "xE" },
    //   },
    // )

    const redis = new elasticache.CfnCacheCluster(this, `RedisCluster`, {
      engine: 'redis',
      cacheNodeType,
      numCacheNodes: 1,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
      cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName,
      cacheParameterGroupName: 'darwin-redis-config',
    })

    redis.addDependsOn(subnetGroup)

    this.port = String(redis.attrRedisEndpointPort)
    this.hostname = redis.attrRedisEndpointAddress
    this.url = createUrl({
      protocol: 'redis',
      port: this.port,
      hostname: this.hostname,
    })

    /**
     * Save values to Cloudformation output
     */
    new cdk.CfnOutput(this, 'redisPort', {
      value: this.port,
    })

    new cdk.CfnOutput(this, 'redisEndpoint', {
      value: this.hostname,
    })

    new cdk.CfnOutput(this, 'redisUrl', {
      value: this.url,
    })

    new ssm.StringParameter(this, baseId(id, 'redisUrlParam'), {
      parameterName: `/${stage}/redis/url`,
      stringValue: this.url,
    })

    cdk.Tags.of(this).add('Stack', id)
    cdk.Tags.of(this).add('CreatedBy', 'cdk')
  }
}
