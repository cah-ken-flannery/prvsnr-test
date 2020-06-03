terraform {
  backend "gcs" {
    bucket = "cool-state-bucket"
    prefix = "terraform/dev/generated/d0_demo"
  }
}