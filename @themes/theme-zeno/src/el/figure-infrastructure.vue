<template>
  <figure>
    <figcaption
      class="text-sm text-center font-mono py-1 bg-purple-700 text-purple-300 rounded-t md:rounded-tl"
    >terraform.tf</figcaption>
    <factor-highlight-code
      class="bg-purple-900 text-gray-500 p-4 text-sm rounded-b md:py-8 md:px-24 md:rounded-none"
    >
      <pre><code class="prism">{{ code() }}</code></pre>
    </factor-highlight-code>
  </figure>
</template>

<script lang="ts">
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import Vue from "vue"

export default Vue.extend({
  components: { factorHighlightCode },
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
})
</script>
