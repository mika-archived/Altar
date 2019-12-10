# API Gateway Configuration

Altar API Gateway

## POST `/execution`

### Integration Request

| Item                 | Value                                      |
| -------------------- | ------------------------------------------ |
| Integration Type     | AWS Service                                |
| AWS Region           | `ap-northeast-1`                           |
| AWS Service          | Step Function                              |
| AWS Subdomain        | `null`                                     |
| HTTP Method          | POST                                       |
| Action               | `StartExecution`                           |
| Execution Role       | ARN of Role                                |
| Credentials cache    | Do not add caller credentials to cache key |
| Content Handing      | Passthrough                                |
| User Default Timeout | Yes                                        |

#### Mapping Templates

##### `application/json`

```
#set( $body = $util.escapeJavaScript($input.json('$')).replaceAll("\\'", "'") )
{
    "input": "$body",
    "stateMachineArn": "ALTAR_STEP_FUNCTION_ARN"
}
```

### Integration Response

#### Mapping Templates

##### `application/json`

```
#set ($uuid = $input.json("$.executionArn").split(":")[7] )
{
  "buildId": "$uuid"
}
```

### GET `/execution/{buildId}`

#### Integration Request

| Item                 | Value                                      |
| -------------------- | ------------------------------------------ |
| Integration Type     | AWS Service                                |
| AWS Region           | `ap-northeast-1`                           |
| AWS Service          | Step Function                              |
| AWS Subdomain        | `null`                                     |
| HTTP Method          | POST                                       |
| Action               | `DescribeExecution`                        |
| Execution Role       | ARN of Role                                |
| Credentials cache    | Do not add caller credentials to cache key |
| Content Handing      | Passthrough                                |
| User Default Timeout | Yes                                        |

#### Mapping Templates

##### `application/json`

```
#set( $buildId = $input.params("buildId") )
{
    "executionArn": "ARN_OF_ALTAR_STEP_FUNCTION_EXECUTION:$buildId"
}
```
