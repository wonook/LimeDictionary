#!flask/bin/python
import os
from app import app


def runserver():
    port = int(os.environ.get('PORT', 3000))
    app.run(debug=True, host='0.0.0.0', port=port)

if __name__ == '__main__':
    runserver()