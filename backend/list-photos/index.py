"""Получение списка фотографий поездки из S3"""
import json
import os
import boto3

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    trip_id = (event.get('queryStringParameters') or {}).get('trip_id')
    if not trip_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'trip_id обязателен'})}

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    prefix = f"trips/{trip_id}/"
    response = s3.list_objects_v2(Bucket='files', Prefix=prefix)
    access_key = os.environ['AWS_ACCESS_KEY_ID']

    urls = [
        f"https://cdn.poehali.dev/projects/{access_key}/files/{obj['Key']}"
        for obj in response.get('Contents', [])
        if not obj['Key'].endswith('/')
    ]

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'photos': urls}),
    }
