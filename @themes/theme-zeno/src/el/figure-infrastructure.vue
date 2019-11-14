<template>
  <figure>
    <figcaption>terraform.tf</figcaption>
    <plugin-highlight-code>
      <pre><code class="prism">{{ code() }}</code></pre>
    </plugin-highlight-code>
  </figure>
</template>

<script>
export default {
  methods: {
    code() {
      return `data "aws_ami" "backend" {
  filter {
    name = "tag:Name"

    values = [
      "backend-v1",
    ]
  }

  most_recent = true
}

resource "aws_instance" "backend1" {
  ami           = "\${data.aws_ami.backend.id}"
  instance_type = "m5.large"

  vpc_security_group_ids = [
    "sg-40b2e613",
  ]

  subnet_id = "subnet-f2e81712"

  root_block_device {
    volume_size = "16"
    volume_type = "gp2"
  }

  tags = {
    Name = "backend1"
  }

  volume_tags = {
    Name = "backend1"
  }
}`
    }
  }
}
</script>