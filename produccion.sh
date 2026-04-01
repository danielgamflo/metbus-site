aws s3 sync . s3://metbus-site/ --delete
aws cloudfront create-invalidation --distribution-id E33B8GJ78OSUMP --paths "/*"