provider "aws" {
  region = "{{region}}"
}
 
# VPC Creation
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "{{vpc}}"
  }
}
 
# Subnet Creation
resource "aws_subnet" "subnet" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "{{subnet}}"
  }
}
 
# Security Group Creation
resource "aws_security_group" "main" {
  vpc_id = aws_vpc.main.id
 
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
 
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
 
  tags = {
    Name = "{{security_group}}"
  }
}
 
# Image Builder Setup
resource "aws_appstream_image_builder" "{{builder_name}}" {
  name                  = "{{builder_name}}"
  instance_type         = "{{instance_type}}"
  image_name            = "{{base_image}}"
  iam_role_arn          = aws_iam_role.{{iam_role}}.arn
  enable_default_internet_access = {{default_internet_access}}
 
  description           = "{{description}}"
  vpc_config {
    subnet_ids          = ["{{subnet}}"]
    security_group_ids  = ["{{security_group}}"]
  }
}
 
# IAM Role for Image Builder
resource "aws_iam_role" "{{iam_role}}" {
  name = "{{iam_role}}"
 
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "appstream.amazonaws.com"
        },
      },
    ],
  })
}
 
# IAM Policy Attachment for Image Builder
resource "aws_iam_role_policy_attachment" "{{iam_role}}_policy" {
  role       = aws_iam_role.{{iam_role}}.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAppStreamServiceAccess"
}
 