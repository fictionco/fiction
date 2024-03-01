# Automation for creating ClickHouse base AMI image

This folder contains the necessary configs for creating an AWS AMI image.
We use [Hashicorp's Packer][hashicorp packer] to build the image.
We need to have an AMI in every region where we have the infrastructure.
In our case the regions are:

- `us-east-1` for development
- `us-west-2` for production

Packer installation process is described [here](https://learn.hashicorp.com/tutorials/packer/getting-started-install).

In short, if you are on Mac - just `brew tap hashicorp/tap` and install with `brew install hashicorp/tap/packer`.

## Building an AMI

Packer expects that the next variables are globally observable:

- `AWS_ACCESS_KEY_ID` - holds AWS API Access key
- `AWS_SECRET_ACCESS_KEY` - holds AWS API Secret Key
- `AWS_REGION` - holds the region where to build an AMI

After everything is done the AMI appears in 2 regions by default: `us-east-1` and `us-west-2`.
This behavior could be overwritten by re-declaring `destination_regions` variable from the command line.
Check out [Packer User Vars] article.

As the main step packer uses [Ansible as a builder](https://www.packer.io/docs/provisioners/ansible). The very first time you need to set up
so called Python's "Virtual Environment" and install Ansible there. The steps are:

```bash
# We are in the project's root folder

# Create virtualenv directory
python3 -m venv .venv

# Use it
source .venv/bin/activate
which python                     # should show you something like /Users/bob/Development//darwin-api/.venv/bin/python
                                 # If it shows you /usr/bin/python or /usr/local/bin/python or something similar which is in more-likely system folder - something is wrong

# Install the libraries/tools
pip install -U pip
pip install -r ./requirements.txt
```

Ok, now you are ready to build an AMI :)

```bash
# Check where you are. We should be in ..../clickhouse/ami folder
pwd                         # Shows smth. like: /Users/bob/Development/darwin-api/clickhouse/ami

# Validating the config
packer validate packer.json

# Inspecting the config
packer inspect packer.json

# Init the virtual env
source ../../.venv/bin/python

# Building an AMI
packer build packer.json
```

If you have no global variables in your shell environment, you can specify the values in the command line (insecure way):

```bash
# Building an AMI
packer build \
  -var 'aws_access_key=AKIA......' \
  -var 'aws_secret_key=SeCr37......key' \
  -var 'aws_region=us-east-1' \
  -var 'clickhouse_version=20.9.3.45' \
  packer.json

```

If you are on heavy development and do not want to destroy the intermediate EC2 machine where AMI gets built - build with something like
`packer build -on-error=ask packer.json`. `-on-error=ask` will wait for the human input if the build process dies.

## Next steps

This instance supports [access control management based on RBAC approach][clickhouse access right]. User `darwin` is the default one. Password is below in the doc.

## Adjusting the AMI

Currently there are some restrictions and hard coded stuff present in the image:

1. SSL Certificates are self signed. Please disable SSL verification while connecting to ClickHouse over SSL protocols. The certificates get recreated during the AMI
   build process.
2. Passwords are hardcoded and encrypted in `host_vars/*.yml` or `group_vars/*.yml`. In the future they should be the parameters to the build process.
3. Ports for incoming connections are hard coded in `group_vars/clickhouse-cluster*.yml` files. Currently they are:
   - http: 8123
   - tcp: 9000
   - https: 8443
   - tcp_secure: 9440
   - interserver_http: 9009
   - mysql: 3306
4. User/passwords:
   - User: `darwin`
     Password: `oU1gR2rU4nE6tJ2l`
     Permissions: Full
     Access from: everywhere
   - User: `ro`
     Password: `dbguest`
     Permissions: Read Only
     Access from: 127.0.0.1
     Databases: `system`
5. Persistent storage should have at least this folders:
   - Data Directory: `/var/lib/clickhouse/`
   - TMP Path: `/var/lib/clickhouse/tmp/`
   - User Files Path: `/var/lib/clickhouse/user_files/`

## TODO

1. We should build in a separate VPC. ([Check][packer builder: vpc filter])
2. Data disk: EFS or EBS Volume?

---

[hashicorp packer]: https://www.packer.io/
[packer's ebs builder]: https://www.packer.io/docs/builders/amazon-ebs
[ebs volume builder]: https://www.packer.io/docs/builders/amazon-ebsvolume
[clickhouse install]: https://clickhouse.tech/docs/en/getting-started/install/
[clickhouse mysql interface]: https://clickhouse.tech/docs/en/interfaces/mysql/
[clickhouse access right]: https://clickhouse.tech/docs/en/operations/access-rights/#access-control
[packer install]: https://learn.hashicorp.com/tutorials/packer/getting-started-install
[packer builder: vpc filter]: https://www.packer.io/docs/builders/amazon-ebs#vpc_filter
[packer user vars]: https://www.packer.io/docs/templates/user-variables.html
[packer ansible builder]: https://www.packer.io/docs/provisioners/ansible
