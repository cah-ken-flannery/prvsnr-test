#!/bin/bash
set -e
set +x

BASE_DIR="$(pwd)/terraform/generated"

ENV_FILTER=$2

export TF_IN_AUTOMATION="true"

ls $BASE_DIR | while read component ; do
  cd $BASE_DIR/$component
  ls
  terraform init -input=false
  terraform apply -auto-approve
done
