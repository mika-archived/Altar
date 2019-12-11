# Step Functions Configuration

Altar Step Functions

```json
{
  "Comment": "A Hello World example of the Amazon States Language using Pass states",
  "StartAt": "ALTAR_INSTALLATION",
  "States": {
    "ALTAR_INSTALLATION": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "ARN_OF_LAMBDA_FUNCTION_ALTAR_INSTALLER:$LATEST",
        "Payload": {
          "body.$": "$"
        }
      },
      "Next": "ALTAR_CONTINUE_TO_EXECUTION"
    },
    "ALTAR_CONTINUE_TO_EXECUTION": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.Payload.status",
          "StringEquals": "success",
          "Next": "ALTAR_EXECUTION"
        },
        {
          "Variable": "$.Payload.status",
          "StringEquals": "fail",
          "Next": "ALTAR_CLEANUP"
        }
      ],
      "Default": "ALTAR_EXECUTION"
    },
    "ALTAR_EXECUTION": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "ARN_OF_LAMBDA_FUNCTION_ALTAR_EXECUTOR:$LATEST",
        "Payload": {
          "state.$": "$.Payload.state"
        }
      },
      "Next": "ALTAR_CONTINUE_TO_RECORD"
    },
    "ALTAR_CONTINUE_TO_RECORD": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.Payload.status",
          "StringEquals": "success",
          "Next": "WAIT_LOGS"
        },
        {
          "Variable": "$.Payload.status",
          "StringEquals": "fail",
          "Next": "ALTAR_CLEANUP"
        }
      ],
      "Default": "WAIT_LOGS"
    },
    "WAIT_LOGS": {
      "Comment": "A Wait state delays the state machine from continuing for a specified time.",
      "Type": "Wait",
      "Seconds": 5,
      "Next": "ALTAR_RECORD"
    },
    "ALTAR_RECORD": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "ARN_OF_LAMBDA_FUNCTION_ALTAR_RECORDER:$LATEST",
        "Payload": {
          "state.$": "$.Payload.state"
        }
      },
      "Next": "ALTAR_CLEANUP"
    },
    "ALTAR_CLEANUP": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "ARN_OF_LAMBDA_FUNCTION_ALTAR_CLEANER:$LATEST",
        "Payload": {
          "state.$": "$.Payload.state"
        }
      },
      "End": true
    }
  }
}
```
