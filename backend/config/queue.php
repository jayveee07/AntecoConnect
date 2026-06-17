<?php

return [

    'default' => env('QUEUE_CONNECTION', 'sync'),

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_QUEUE_CONNECTION'),
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'gcp-tasks' => [
            'driver' => 'gcp-tasks',
            'project_id' => env('GOOGLE_CLOUD_PROJECT_ID'),
            'location' => env('GCP_TASKS_LOCATION', 'asia-southeast1'),
            'queue' => env('GCP_TASKS_QUEUE', 'default'),
            'handler' => env('APP_URL') . '/handle-task',
            'service_account_email' => env('GCP_TASKS_SERVICE_ACCOUNT'),
        ],

    ],

    'batching' => [
        'database' => env('DB_CONNECTION', 'pgsql'),
        'table' => 'job_batches',
    ],

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database'),
        'database' => env('DB_CONNECTION', 'pgsql'),
        'table' => 'failed_jobs',
    ],

];
