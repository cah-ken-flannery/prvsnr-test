.PHONY: install_generator
install_generator: ## Install generator dependencies
	cd generator/; npm install

.PHONY: start_kind
start_kind: ## Create a Kind Cluster for generating types
	kind create cluster --name=kpt-functions \
		--config=generator/kubernetes/kind.yaml \
		--image=kindest/node:v1.16.4

.PHONY: stop_kind
stop_kind: ## Destroy the kind cluster
	kind delete cluster --name=kpt-functions

.PHONY: apply_definitions
apply_definitions: ## Apply the CRDs to your current Kubernetes context
	kubectl apply -f generator/kubernetes/definitions/

.PHONY: apply_data
apply_data: ## Apply the real configs to your local Kubernetes context
	kubectl apply -R -f data/

.PHONY: generate_types
generate_types: ## Generate the typescript library for configured CRDs
	cd generator/; npm run kpt:type-create

.PHONY: watch_generator
watch_generator: ## Start the typescript generator in dev mode
	cd generator/; npm run watch

.PHONY: generate_terraform
generate_terraform: ## Generate the Terraform code for provisioning configs
	kpt fn source data/| \
		node generator/dist/generate_tf_run.js -d sink_dir=terraform/generated/
	terraform fmt -recursive terraform/generated

.PHONY: insert_data
insert_data: ## Insert test data into datasets
	kpt fn source data/| \
		node generator/dist/insert_data_run.js

.PHONY: apply_terraform
apply_terraform: ## Apply the generated Terraform code
	./scripts/tf-apply-all.sh

.PHONY: help
help: ## Prints help for targets with comments
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "make \033[36m%- 30s\033[0m %s\n", $$1, $$2}'
