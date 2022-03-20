import calendar
import time


def arr_to_dict(arr, keys):
    """
    transform an array to a dictionary
    :param arr: Array some data
    :param keys: Array some keys
    :return: return a dict data indexed by keys
    """
    result = {}
    for i in range(len(keys)):
        result[keys[i]] = arr[i]
    return result


def get_current_time():
    return calendar.timegm(time.gmtime())
