#!/bin/bash

set -e

if [ -z "$GIT_REPOSITORY_URL" ]; then
  echo "Error: GIT_REPOSITORY_URL is not set"
  exit 1
fi

if [ -d "/home/app/output" ]; then
  echo "Removing existing /home/app/output directory..."
  rm -rf /home/app/output
fi

echo "Cloning repository from $GIT_REPOSITORY_URL..."
git clone "$GIT_REPOSITORY_URL" /home/app/output

echo "Executing script..."
exec node script.ts