aws s3 sync . s3://staging-metbus-site/ --delete
aws cloudfront create-invalidation --distribution-id ERAGX2ORKGDNP --paths "/*"