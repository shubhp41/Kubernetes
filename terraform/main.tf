provider "google" {
  credentials = file("/home/shubhpatel225/kubernatives-388300-6bc1ce35aa90.json")
}

resource "google_container_cluster" "cluster" {
  name               = "my-cluster"
  location           = "us-central1"
  initial_node_count = 1

  remove_default_node_pool = true
}

resource "google_container_node_pool" "pool" {
  name           = "default-pool"
  cluster        = google_container_cluster.cluster.name
  location       = google_container_cluster.cluster.location
  initial_node_count = 1

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    image_type   = "COS_CONTAINERD"
  }

  lifecycle {
    ignore_changes = [
      node_config[0].oauth_scopes,
    ]
  }
}
