#!/bin/bash
set -e

STACK_NAME="DeployWebAppStack"
BUILD_DIR="./resources/build"

echo "🔍 Fetching stack outputs from CloudFormation exports..."
BUCKET=$(aws cloudformation list-exports \
  --query "Exports[?Name=='BucketName'].Value" \
  --output text)

DIST_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='CloudFrontDistributionId'].Value" \
  --output text)

if [ -z "$BUCKET" ] || [ -z "$DIST_ID" ]; then
  echo "❌ Could not retrieve stack outputs. Make sure the stack is deployed."
  exit 1
fi

echo "✅ Bucket:          $BUCKET"
echo "✅ Distribution ID: $DIST_ID"
echo ""
echo "📦 Uploading '$BUILD_DIR' to s3://$BUCKET ..."
aws s3 sync "$BUILD_DIR" "s3://$BUCKET" --delete

echo ""
echo "🔄 Creating CloudFront invalidation..."
INVALIDATION=$(aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --output json)

INVALIDATION_ID=$(echo "$INVALIDATION" | grep '"Id"' | head -1 | sed 's/.*"Id": "\(.*\)".*/\1/')
STATUS=$(echo "$INVALIDATION" | grep '"Status"' | head -1 | sed 's/.*"Status": "\(.*\)".*/\1/')

echo ""
echo "✅ Publish complete! Your app is live."
echo "   Invalidation ID:     $INVALIDATION_ID"
echo "   Invalidation Status: $STATUS"
