import * as cdk from 'aws-cdk-lib'
import type { Construct } from 'constructs'
import { ServiceStack } from '../stack-services'
import { PostgresStack } from '../stack-postgres'
import { RedisStack } from '../stack-redis'
import { VpcStack } from '../stack-vpc'
import { StaticStack } from '../stack-static'
import type { CustomStackProps, StageId } from '../config'
import { awsEnv, baseId } from '../config'
import { ClickhouseStack } from './__stack-chch'

/**
 * Create an instance of the entire backend API
 * A "stage" creates a CDK stage of stacks/resources meant to be deployed together
 */
export class PrimaryStage extends cdk.Stage {
  urls: { name: string, output: cdk.CfnOutput }[]
  clickhouseIp?: string
  constructor(scope: Construct, id: StageId, props?: CustomStackProps) {
    super(scope, id, props)

    const env = awsEnv()

    const stackProps: CustomStackProps = {
      stage: id,
      env,
      version: Date.now(),
    }

    /**
     * Cloudfront utils must be based out of us-east-1
     */
    new StaticStack(this, baseId('Static'), stackProps)

    /**
     * 1. Create the VPC that all stacks will share
     */
    const vpcInstance = new VpcStack(this, baseId('Vpc'), stackProps)

    stackProps.vpc = vpcInstance.vpc

    /**
     * 2. Create resources needed by services (e.g. clickhouse/redis)
     */
    const clickhouseInstance = new ClickhouseStack(
      this,
      baseId('Clickhouse'),
      stackProps,
    )

    clickhouseInstance.addDependency(vpcInstance)
    this.clickhouseIp = clickhouseInstance.publicIp

    const redisInstance = new RedisStack(this, baseId('Redis'), stackProps)
    redisInstance.addDependency(vpcInstance)

    const postgresInstance = new PostgresStack(
      this,
      baseId('Postgres'),
      stackProps,
    )
    postgresInstance.addDependency(vpcInstance)

    /**
     * 3. Add the ECS stack for Node Services
     */
    const serviceInstance = new ServiceStack(
      this,
      baseId('Service'),
      stackProps,
    )

    serviceInstance.addDependency(vpcInstance)
    serviceInstance.addDependency(clickhouseInstance)
    serviceInstance.addDependency(redisInstance)
    serviceInstance.addDependency(postgresInstance)
    this.urls = serviceInstance.urls
  }
}
