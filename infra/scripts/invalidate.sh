#!/bin/bash
set -e

STACK_NAME="DeployWebAppStack"

echo "🔍 Fetching CloudFront distribution ID from CloudFormation stack outputs..."
DIST_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='CloudFrontDistributionId'].Value" \
  --output text)

if [ -z "$DIST_ID" ]; then
  echo "❌ Could not retrieve CloudFront distribution ID. Make sure the stack is deployed."
  exit 1
fi

echo "✅ Distribution ID: $DIST_ID"
echo ""
echo "🔄 Creating CloudFront invalidation..."
INVALIDATION=$(aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --output json)

INVALIDATION_ID=$(echo "$INVALIDATION" | grep '"Id"' | head -1 | sed 's/.*"Id": "\(.*\)".*/\1/')
STATUS=$(echo "$INVALIDATION" | grep '"Status"' | head -1 | sed 's/.*"Status": "\(.*\)".*/\1/')

echo ""
echo "✅ Invalidation created!"
echo "   ID:     $INVALIDATION_ID"
echo "   Status: $STATUS"
