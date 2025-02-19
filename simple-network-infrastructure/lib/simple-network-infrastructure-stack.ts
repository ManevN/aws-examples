import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class SimpleNetworkInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-new-vpc', {
      vpcName: 'my-new-vpc',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 1,
      createInternetGateway: true,
      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        }
      ]
    });

    const publicInstanceSecurityGroup = new ec2.SecurityGroup(this, 'PublicInstanceSG', {
      securityGroupName: 'public-instance-sg',
      vpc,
      allowAllOutbound: true, 
    });

    const privateInstanceSecurityGroup = new ec2.SecurityGroup(this, 'PrivateInstanceSG', {
      securityGroupName: 'private-instance-sg',
      vpc,
      allowAllOutbound: true, 
    });

    publicInstanceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.HTTP,
      'Allow HTTP TCP inbound traffic'
    );

    publicInstanceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.HTTPS,
      'Allow HTTPS TCP inbound traffic'
    );

    privateInstanceSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(publicInstanceSecurityGroup.securityGroupId),
      ec2.Port.tcp(5432),
      'Allow DB access from the API only'
    )
  
    new cdk.CfnOutput(this, 'VpcId', {value: vpc.vpcId})

    new cdk.CfnOutput(this, 'Public SubnetId', {
      value: vpc.publicSubnets[0].subnetId,
      description: 'Public Subnet ID'
    })

    new cdk.CfnOutput(this, 'Private Subnet Id', {
      value: vpc.isolatedSubnets[0].subnetId,
      description: 'Private Subnet ID'
    })

    new cdk.CfnOutput(this, 'PublicInstanceSecurityGroup', {
      value: publicInstanceSecurityGroup.securityGroupId,
    });

    new cdk.CfnOutput(this, 'PrivateInstanceSecurityGroup', {
      value: privateInstanceSecurityGroup.securityGroupId,
    });

  }
}
