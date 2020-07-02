// Sorry for the bad javascript... it's been a while - been doing everything in Go

const mysql = require('mysql')

const db = mysql.createPool({
    "host": "localhost",
    "user": "root",
    "password": "test",
    "database": "tester",
    "driver": "mysql",
    "port": 9306,
    "multipleStatements": true
})

const query = async function(qry, args) {
    return new Promise((resolve) => {
        db.query(qry, args, (err, res) => resolve([res, err]))
    })
}

const reset = async function() {
    await query('TRUNCATE order_items');
    return query('TRUNCATE orders');
}

const seed = async function() {
    await query(`INSERT INTO orders SET ?`, {
        number: '1',
    });
    await query(`INSERT INTO orders SET ?`, {
        number: '2',
    });

    await query(`INSERT INTO order_items SET ?`, {
        name: 'some item',
        order_id: 1,
    });
    await query(`INSERT INTO order_items SET ?`, {
        name: 'some item 2',
        order_id: 1,
    });

    await query(`INSERT INTO order_items SET ?`, {
        name: 'some item',
        order_id: 2,
    });
    await query(`INSERT INTO order_items SET ?`, {
        name: 'some item 2',
        order_id: 2,
    });

    return Promise.resolve();
}

const run = async function() {
    await reset();
    await seed();

    let [res, err] = await query(`
        SELECT

        orders.*,
        JSON_OBJECTAGG(order_items.id,order_items.name) as oi

        FROM orders
        INNER JOIN order_items ON order_items.order_id = orders.id

        GROUP BY orders.id
    `);
    if (err) {
        return Promise.reject(err);
    }

    for (const [index,val] of res.entries()) {
        console.log(val);
        //res[index].oi = val.oi
    }

    return Promise.resolve();
}

run()
    .then(() => process.exit())
    .catch((err) => {
        console.error(err);
        process.exit();
    });