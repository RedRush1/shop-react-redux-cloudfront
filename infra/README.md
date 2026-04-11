# CDK TypeScript — Static Web App on S3 + CloudFront

Deploys a React/SPA build to **S3** (private) served via **CloudFront** (HTTPS, OAC), managed with **AWS CDK v2** in TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

---

## Prerequisites

- Node.js & npm
- AWS CLI configured (`aws configure`)
- AWS CDK CLI: `npm install -g aws-cdk`

---

## Project Structure

```
bin/infra.ts              # CDK app entry point
lib/
  deploy-web-app-stack.ts # CDK Stack
  deployment-service.ts   # Construct: S3 bucket + CloudFront + BucketDeployment
resources/
  build/                  # Web app build output (uploaded to S3)
scripts/
  upload.sh               # Syncs resources/build → S3 bucket
  invalidate.sh           # Creates a CloudFront cache invalidation
  publish.sh              # upload + invalidate combined
```

---

## Workflows

### 1. Initial Setup — Bootstrap + Deploy Infrastructure

Run once per AWS account/region to set up CDK toolkit resources:

```bash
npm run bootstrap
```

Build TypeScript and deploy the full CDK stack (S3 + CloudFront + initial upload):

```bash
npm run deploy:full
```

> This compiles the CDK app (`tsc`) and runs `cdk deploy`, which provisions the S3 bucket, CloudFront distribution, uploads `resources/build`, and invalidates the cache automatically.

---

### 2. App Updates — Upload Build + Invalidate Cache

After updating your web app build in `resources/build/`, publish changes without re-deploying infrastructure:

```bash
npm run publish
```

Or run the steps individually:

```bash
npm run upload      # aws s3 sync resources/build → S3 bucket
npm run invalidate  # aws cloudfront create-invalidation --paths "/*"
```

> Stack outputs (`BucketName`, `CloudFrontDistributionId`) are read automatically from the deployed CloudFormation stack.

---

### 3. Destroy Infrastructure

Tears down the CloudFront distribution and S3 bucket (including all bucket contents):

```bash
npm run destroy
```

---

## All npm Scripts

| Script | Description |
|---|---|
| `npm run build` | Compile TypeScript to JS |
| `npm run watch` | Watch and compile on change |
| `npm run test` | Run Jest unit tests |
| `npm run bootstrap` | Bootstrap CDK toolkit in your AWS account/region |
| `npm run synth` | Emit the synthesized CloudFormation template |
| `npm run deploy` | Deploy CDK stack to AWS |
| `npm run deploy:full` | Build TypeScript then deploy CDK stack |
| `npm run destroy` | Destroy the deployed stack (S3 + CloudFront) |
| `npm run upload` | Sync `resources/build` to the S3 bucket |
| `npm run invalidate` | Create a CloudFront cache invalidation |
| `npm run publish` | Upload build to S3 and invalidate CloudFront cache |

---

## Stack Outputs

After deployment, the following values are available in the CloudFormation console and via CLI:

| Output Key | Description |
|---|---|
| `CloudfrontURL` | CloudFront domain name (your website URL) |
| `CloudFrontDistributionId` | CloudFront distribution ID (used for invalidations) |
| `BucketName` | S3 bucket name (used for uploads) |

---

## Deployed App Links

| Deployment | URL |
|---|---|
| Deployed via AWS Console | https://d352iqmq0ws01d.cloudfront.net/ |
| Deployed via CDK | https://d3nv2wihrbag8w.cloudfront.net/ |

