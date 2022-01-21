import { App } from '@aws-cdk/core'
import * as ssp from '@aws-quickstart/ssp-amazon-eks';
import { TeamPlatform, TeamApplication } from '../teams';

const app = new App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

const blueprint = ssp.EksBlueprint.builder()
  .account(account)
  .region(region)
  .addOns(new ssp.ClusterAutoScalerAddOn)
  .teams(new TeamPlatform(account), new TeamApplication('burnham'));
  
  const repoUrl = 'https://github.com/aws-samples/ssp-eks-workloads.git';

// Add ArgoCD parameters
const bootstrapRepo : ssp.ApplicationRepository = {
    repoUrl,
    targetRevision: 'workshop',
}

const prodBootstrapArgo = new ssp.ArgoCDAddOn({
    bootstrapRepo: {
        ...bootstrapRepo,
        path: 'envs/prod'
    },
});

  
// Build Codepipeline
ssp.CodePipelineStack.builder()
  .name("ssp-eks-workshop-pipeline")
  .owner("camba1")
  .repository({
      repoUrl: 'my-ssp',
      credentialsSecretName: 'github-token',
      targetRevision: 'main'
  })
    // Add stages
  .stage({
    id: 'prod',
    stackBuilder: blueprint.clone('us-west-2')
      .addOns(
          prodBootstrapArgo,
      )
  })
  .build(app, 'pipeline-stack', {env});