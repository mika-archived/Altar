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
  "buildId": "$uuid
}
```

## GET `/execution/{buildId}`

### Integration Request

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

### Integration Response

#### Mapping Template

##### `application/json`

```
#set ($uuid = $input.json("$.executionArn").split(":")[7])
#set ($output = $input.path("$.output"))
{
    "buildId": "$uuid,
#if ( $output )
    #set ($obj = $util.parseJson($output))
    "status": "$obj.Payload.status",
    "id": "$obj.Payload.state.id",
    "executor": "$obj.Payload.state.executor",
    "files": [
      #foreach ($file in $obj.Payload.state.files)
      {
        "name": "$file.name",
        #set ($content = $util.escapeJavaScript($file.content).replaceAll("\\'", "'"))
        "content": "$content"
      }
      #if ($foreach.hasNext) , #end
      #end
    ],
    "dependencies": [
      #foreach ($dependency in $obj.Payload.state.dependencies)
      {
        "name": "$dependency.name",
        "version": "$dependency.version"
      }
      #if ($foreach.hasNext) , #end
      #end
    ],
    #set ($out = $util.escapeJavaScript($obj.Payload.state.logs).replaceAll("\\'", "'"))
    "out": "$out"
#else
    "status": "running",
    "id": null,
    "executor": "unknown",
    "files": [],
    "dependencies": [],
    "out": null
#end
}
```
