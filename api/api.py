from flask import Flask
from flask_restful import Resource, Api
from random import choice
from requests import get
from flask_cors import CORS
from haversine import haversine

app = Flask(__name__)
api = Api(app)
cors = CORS(app)

"""
I know these are not production-ready datastores. I chose to just use
a couple of dictionaries instead of setting up a database
in order to keep this sample project simple.
"""

# The type of trip a user wants to go on
categories = {
    'relaxation': 1,
    'danger': 2,
    'excitement': 3,
    'romance': 4
}

"""
A list of countries that fit each category.
These categorizations were chosen on an entirely
subjective, arbitrary basis for demonstration purposes
only.
"""
countries = {
    'Thailand': {'category': 3},
    'North Korea': {'category': 2},
    'Somalia': {'category': 2},
    'Japan': {'category': 3},
    'Iceland': {'category': 1},
    'Norway': {'category': 1},
    'Croatia': {'category': 1},
    'India': {'category': 3},
    'France': {'category': 4},
    'Peru': {'category': 1},
    'Spain': {'category': 4},
    'Italy': {'category': 4},
    'Indonesia': {'category': 1},
    'Afghanistan': {'category': 2},
    'Iraq': {'category': 2},
    'Singapore': {'category': 1},
    'Slovenia': {'category': 1},
    'United Arab Emirates': {'category': 3},
    'Turkey': {'category': 3}
}


class PreferencesAPI(Resource):

    """
    Randomly select a destination based on specified preference
    Data source: REST Countries
    """

    def get(self, preference):
        possible_choices = []
        for country, properties in countries.items():
            if properties['category'] == categories[preference]:
                possible_choices.append(country)
        selection = choice(possible_choices)
        country = get('https://restcountries.eu/rest/v1/name/' +
                      selection, params={'fullText': True})
        return country.json()


class ExchangeRatesAPI(Resource):

    """
    Compare a currency to USD
    Data source: OpenExchangeRates

    Notes:
    - Using a free plan, which means there is only one base currency (USD) allowed
    - Free plan is also limited to 1,000 queries per month 
    """

    def get(self, comparison):
        key = '3c350b71f4e249f1a01c7573fb3b9998'
        currencies = get(
            'https://openexchangerates.org/api/latest.json', params={'app_id': key}).json()
        return [{'exchange_rate': currencies['rates'][comparison]}]


class MapsAPI(Resource):

    """
    Get map data and return distance via the Haversine formula (in miles)
    Data source: Google Maps Geocode API
    """

    def get(self, origin, destination):
        params1 = {'key': 'AIzaSyAUsJWHmrd9F5fY3M0WdKFZ92aaUnf60xc',
                   'address': origin}
        coords_1 = get(
            'https://maps.googleapis.com/maps/api/geocode/json', params=params1).json()['results'][0]['geometry']['location']
        params2 = {'key': 'AIzaSyAUsJWHmrd9F5fY3M0WdKFZ92aaUnf60xc',
                   'address': destination}
        coords_2 = get(
            'https://maps.googleapis.com/maps/api/geocode/json', params=params2).json()['results'][0]['geometry']['location']

        start = (coords_1['lat'], coords_1['lng'])
        end = (coords_2['lat'], coords_2['lng'])

        total_distance = haversine(start, end, miles=True)

        return [{'distance': int(total_distance)}]

api.add_resource(PreferencesAPI, '/prefs/<preference>')
api.add_resource(ExchangeRatesAPI, '/rates/<comparison>')
api.add_resource(MapsAPI, '/distance/<origin>/<destination>')

if __name__ == '__main__':
    app.run(debug=True)
