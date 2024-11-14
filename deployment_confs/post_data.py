import os

import pandas as pd
import requests

input_file = "test.csv"
api_address = "http://localhost:5000/api/"
admin_login = "admin"
admin_password = "admin"

auth_header = None
this_dir = os.path.dirname(__file__)

devices_df: pd.DataFrame
class_id_map: dict[str, int]

headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
}

def login():
    json = {
        "username": admin_login,
        "password": admin_password
    }
    res = requests.post(api_address+"auth/login", headers=headers, json=json)
    if res.status_code == 200:
        headers["Authorization"] = f"Bearer {res.json()['access_token']}"


def load_input_file():
    df = pd.read_csv(os.path.join(this_dir, input_file),delimiter=";", index_col=0, keep_default_na=False)
    df = df.reset_index()
    print("input csv loaded")
    print(df.to_string())
    return df

def post_classes():
    for device_class in devices_df["dev_class"].unique():
        json = {
            "class_name": device_class
        }
        res = requests.post(api_address+"classes", headers=headers, json=json)
        if res.status_code != 200 and res.status_code != 409:
            print(res.text)
    print("classes created")

def read_class_ids():
    res = requests.get(api_address+"classes", headers=headers)
    class_map = {item['class_name']: item['class_id'] for item in res.json()}
    print("database classes read")
    print(class_map)
    return class_map

def post_devices():
    to_json_df = devices_df
    to_json_df['class_id'] = to_json_df['dev_class'].map(class_id_map)
    to_json_df.drop(['dev_class'], axis=1, inplace=True)
    devices_json = to_json_df.to_dict(orient="records")
    res = requests.post(api_address+"devices", headers=headers, json=devices_json)
    print(res.text)


if __name__ == '__main__':
    login()
    devices_df = load_input_file()
    post_classes()
    class_id_map = read_class_ids()
    post_devices()

