import time
from enum import IntEnum
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder="static/dist", template_folder="static")


class Region(IntEnum):
    central_and_western = 0
    eastern = 1
    southern = 2
    wan_chai = 3
    sham_shui_po = 4
    kowloon_city = 5
    kwun_tung = 6
    wong_tai_sin = 7
    yau_tsim_mong = 8
    islands = 9
    kwai_tsing = 10
    north = 11
    sai_kung = 12
    tai_po = 13
    tsuen_wan = 14
    tuen_mun = 15
    yeun_long = 16


class OrderStatus(IntEnum):
    preparing_food = 0
    waiting_for_driver = 1
    delivering = 2
    delivered = 3


class RiderStatus(IntEnum):
    idle = 0
    picking_up = 1
    delivering = 2


class Riders:
    def __init__(self):
        self.lst = []
        self.id = 1000

    def bump_id(self):
        tmp = self.id
        self.id += 1
        return tmp

    def add_new_rider(self, name, preferred_region):
        self.lst.append({
            'id': self.bump_id(),
            'name': name,
            'preferred_region': preferred_region,
            'current_job_id': None
        })

    def json(self):
        return jsonify(self.lst)


class Orders:
    def __init__(self):
        self.lst = []
        self.id = 14538

    def bump_id(self):
        tmp = self.id
        self.id += 1
        return tmp

    def add_new_order(self, store, store_address, destination, region, customer_name):
        new_id = self.bump_id()
        self.lst.append({
            'id': new_id,
            'store': store,
            'store_address': store_address,
            'destination': destination,
            'region': region,
            'customer_name': customer_name,
            'order_time': int(time.time()),
            'order_status': OrderStatus.preparing_food,
            'rider_id': None
        })
        return new_id

    def update_order_status(self, _id, request_body):
        for order in self.lst:
            if order['id'] == _id:
                order['order_status'] = OrderStatus(request_body['status'])
                if request_body['status'] == 2:
                    order['rider_id'] = request_body['rider_id']

    def json(self):
        return jsonify(self.lst)


riders_db = Riders()
riders_db.add_new_rider('Thomas Ip', Region.sai_kung)

orders_db = Orders()
orders_db.add_new_order(
    'KFC Hau Tak',
    'Shop E165A, 1/F, East Wing, TKO Gateway, Hau Tak Estate, Tseung Kwan O',
    'China Gardens, G/F, Academic Building, Hong Kong University of Science and Technology, Clear Water Bay',
    Region.sai_kung,
    'Test user A'
)
orders_db.add_new_order(
    'KFC Metro City',
    'Shop 2057-59, Level 2, Metro City Phase II, Tseung Kwan O',
    'Lohas Park, Wan Po Rd, Siu Chik Sha',
    Region.sai_kung,
    'Test user B'
)
orders_db.add_new_order(
    'KFC',
    'Shop A, G/F & 1/F, 2-4 Cameron Road, Tsim Sha Tsui',
    '60 Chung Hau St, Ho Man Tin',
    Region.wan_chai,
    'Test user C'
)

@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        return orders_db.json()
    elif request.method == 'POST':
        new_order = request.get_json()
        new_id = orders_db.add_new_order(**new_order)
        return jsonify({'id': new_id})


@app.route('/api/orders/region/<int:region_id>', methods=['GET'])
def orders_narrow_region(region_id):
    return jsonify(list(filter(lambda order: order['region'] == region_id, orders_db.lst)))


@app.route('/api/orders/<int:order_id>', methods=['GET', 'PUT'])
def orders_narrow_id(order_id):
    if request.method == 'GET':
        for order in orders_db.lst:
            if order['id'] == order_id:
                return jsonify(order)
    elif request.method == 'PUT':
        body = request.get_json()
        orders_db.update_order_status(order_id, body)
        return jsonify(True)


@app.route('/api/riders', methods=['GET'])
def riders():
    return riders_db.json()


@app.route('/api/riders/<int:rider_id>', methods=['GET'])
def riders_narrow_id(rider_id):
    for r in riders_db.lst:
        if r['id'] == rider_id:
            return jsonify(r)
    return jsonify(None)


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=4000, debug=True)
