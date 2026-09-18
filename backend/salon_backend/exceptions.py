from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None and isinstance(response.data, dict):
        if 'error' in response.data and isinstance(response.data['error'], list) and len(response.data['error']) == 1:
            response.data['error'] = str(response.data['error'][0])

    return response
