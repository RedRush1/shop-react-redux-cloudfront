#!/bin/bash
set -e

STACK_NAME="DeployWebAppStack"
BUILD_DIR="./resources/build"

echo "🔍 Fetching S3 bucket name from CloudFormation stack outputs..."
BUCKET=$(aws cloudformation list-exports \
  --query "Exports[?Name=='BucketName'].Value" \
  --output text)

if [ -z "$BUCKET" ]; then
  echo "❌ Could not retrieve bucket name. Make sure the stack is deployed."
  exit 1
fi

echo "✅ Bucket: $BUCKET"
echo ""
echo "📦 Uploading '$BUILD_DIR' to s3://$BUCKET ..."
aws s3 sync "$BUILD_DIR" "s3://$BUCKET" --delete

echo ""
echo "✅ Upload complete."

