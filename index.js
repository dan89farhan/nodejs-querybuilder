'user strict';
var sql = require('./src/db/dbconfig');
let queryBuilder = function () {
    let _query = '';
    let _whereColumns = [];
    return {
        select: function (selectColumns = '*') {
            _query = _query + `SELECT ${selectColumns} from`;
            return this;
        },
        from: function (table) {
            if (table && typeof table == 'string') {
                _query = _query + ' ' + table;
                return this;
            }
            throw new Error("Please enter table name");
        },
        whereOverload1: function (columnName, value) {
            value = this.checkValue(value);
            _query = _query + ` WHERE ${columnName} = ${value}`;
            return this;
        },
        where: function (columnName, operator, value) {
            if (!value) {
                this.whereOverload1(columnName, operator);
                return this;
            } else {
                value = this.checkValue(value);
                _query = _query + ` WHERE ${columnName} ${operator} ${value}`;
                return this;
            }
        },
        andWhereOverload1: function (columnName, value) {
            value = this.checkValue(value);
            _query = _query + ` AND ${columnName} = ${value}`;
            return this;
        },
        andWhere: function (columnName, operator, value) {
            if (!value) {
                this.andWhereOverload1(columnName, operator);
                return this;
            } else {
                value = this.checkValue(value);
                _query = _query + ` AND ${columnName} ${operator} ${value}`;
                return this;
            }

        },
        orWhere: function (columnName, value) {
            value = this.checkValue(value);
            _query = _query + ` OR ${columnName} = ${value}`
            return this;
        },
        orWhere: function (columnName, operator, value) {
            value = this.checkValue(value);
            _query = _query + ` OR ${columnName} ${operator} ${value}`;
            return this;
        },
        between: function (columnName, value1, value2) {
            value1 = this.checkValue(value1);
            value2 = this.checkValue(value2);
            _query = _query + ` WHERE ${columnName} BETWEEN ${value1} AND ${value2}`;
            return this;
        },
        andBetween: function (columnName, value1, value2) {
            value = this.checkValue(value);
            _query = _query + ` AND WHERE ${columnName} BETWEEN ${value1} AND ${value2}`;
            return this;
        },
        orBetween: function (columnName, value1, value2) {
            value = this.checkValue(value);
            _query = _query + ` OR WHERE ${columnName} BETWEEN ${value1} AND ${value2}`;
            return this;
        },
        getSql: function () {
            return _query;
        },
        run: function (query = null) {
            return new Promise((resolve, reject) => {
                sql.getConnection(function (err, conn) {
                    if (err) {
                        conn.release();
                        reject(err)
                    }
                    // 'SELECT * FROM products where ' + field + '=?', value
                    if (query)
                        _query = query;
                    conn.query(_query, function (err, rows) {
                        conn.release();
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
            });
        },
        checkValue: function (value) {
            if (typeof value == 'function' || typeof value == 'object' || typeof value == 'symbol' || typeof value == 'undefined') {
                throw Error('Expection integer or string value but found ' + typeof value);
            }
            else if (typeof value == 'bigint' || typeof value == 'boolean' || typeof value == 'number') {
                return value;
            }
            else {
                return `'${value}'`;
            }
        },
    };
};

module.exports = queryBuilder;