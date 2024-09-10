Setup linux:
```
sudo apt update
sudo apt install python3
python3 --version (check if correctly installed)
sudo apt install python3-pip
```

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
   
without debug mode:
```
flask run
```

With debug mode:
```
cd .. (to the root directory)
python3 -m backend.app
```

To run tests:
```
pytest
```

Run test with coverage:
```
pytest --cov=backend --cov-report=term-missing
```
