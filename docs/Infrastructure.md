##Infrastructure

## Service Infrastructure

```
  +------------+   +--------------+  +-------------+
  |  Internet  +-+-+  CloudFront  +--+  S3 Static  |
  +------------+ | +--------------+  +-------------+
                 |
                 | +---------------+  +------------------+  +----------+   +-------+  +-------+
                 +-+  API Gateway  +--+  Step Functions  +--+  Lambda  +-+-+  ECS  +--+  EFS  |
                   +---------------+  +------------------+  +----------+ | +-------+  +-------+
                                                                         |
                                                                         | +------------+
                                                                         +-+  DynamoDB  |
                                                                         | +------------+
                                                                         |
                                                                         | +--------------+
                                                                         +-+  CloudWatch  |
                                                                           +--------------+
```

## Application Flow

1. User sends a Perl 5 code to API Gateway using WebSocket.
1. API Gateway calls onConnect function to Lambda.
1. User sends a WebSocket message `{"action": "run", "data": "PERL5_CODE"}` to API Gateway.
1. Lambda runs a task that installs CPAN modules and sends statuses to user.
1. Lambda create a new ECS task definition for this execution.
1. Lambda runs a task, collect results from CloudWatch and record it to DynamoDB.
1. Lambda sends result data to user.
