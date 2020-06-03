terraform {
  backend "gcs" {
    bucket = "cah-dm-dev-provisioner"
    prefix = "terraform/dev/generated/d0_demo"
  }
}