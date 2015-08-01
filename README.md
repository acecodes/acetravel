# AceTravel
### Travel recommendations based on your personal needs.

---

####Main technologies used: **Flask, Angular, Node, Bootstrap (with Bootswatch stylings)**
####Data sources: **OpenExchangeRates, Google Maps, REST Countries**

---
#### NOTE: This is purely a proof-of-concept that I wrote when asked by a potential employer to create a sample app, and if I proceed with turning this into something more significant, its operational structure will be entirely different.

I believe that travel should be tailored to what you specifically need to experience, not necessarily what is within a specific budget or any other arbitrary measure. Travel should be used to grow as a person, and we each have areas we need growth in. Some people have spent too much time in the office and not enough time seeing what the rest of the world has to offer. AceTravel aims to remedy this issue by providing travel recommendations based on what your life is lacking.

To start AceTravel on your local machine, you'll need to start the back-end server (which is written in Python 3.4 with the Flask framework) and then start a separate frontend Node server for the front-end (written in JavaScript with AngularJS and Bootstrap/Bootswatch).

First, you'll need to build a virtual environment, install dependencies on it and then start the API:

    <start in the main acetravel folder>
    $ cd api
    $ virtualenv -p python3.4 venv
    $ source venv/bin/activate
    (venv) $ pip install -r requirements.txt
    (venv) $ python api.py

Open another terminal window, install the Node dependencies and fire up the Node server:

    <start in the main acetravel folder>
    $ npm install
    $ node server

The Node server is necessary to avoid issues in some browsers, primarily Chrome.

Once those are both up and running, navigate to `localhost:9000` in your browser. Enjoy!

