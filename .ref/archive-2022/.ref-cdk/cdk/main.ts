import * as cdk from 'aws-cdk-lib'
import { ServiceStack } from './stack-services'

// import { PostgresStack } from "./stack-postgres"
// import { RedisStack } from "./stack-redis"
import { VpcStack } from './stack-vpc'
import { StaticStack } from './stack-static'
import type { CustomStackProps, StageId } from './config'
import { awsEnv, stageId } from './config'

const app = new cdk.App()

const stage: StageId = 'prod'

const env = awsEnv()

const stackProps: CustomStackProps = {
  stage,
  env,
  version: Date.now(),
}

new StaticStack(app, stageId(stage, 'Script'), stackProps)

const vpcInstance = new VpcStack(app, stageId(stage, 'Vpc'), stackProps)

stackProps.vpc = vpcInstance.vpc

// const redisInstance = new RedisStack(app, stageId(stage, "Redis"), stackProps)
// redisInstance.addDependency(vpcInstance)

// const postgresInstance = new PostgresStack(
//   app,
//   stageId(stage, "Postgres"),
//   stackProps,
// )
// postgresInstance.addDependency(vpcInstance)

const serviceInstance = new ServiceStack(
  app,
  stageId(stage, 'Service'),
  stackProps,
)

serviceInstance.addDependency(vpcInstance)

app.synth()
