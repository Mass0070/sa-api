import mysql, { PoolConnection } from 'mysql2';
const { mariadb } = require('config/config');

const connection = mysql.createPool({
    host: mariadb.host,
    user: mariadb.user,
    password: mariadb.pass,
    database: mariadb.db,
    connectionLimit: 10,
    connectTimeout: 2000,
    charset: 'utf8mb4_unicode_ci',
});

function runQuery(sql: string, namedValues?: Partial<{ [key: string]: any }>): Promise<any> {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            if (err) {
                reject(err);
                return;
            }

            conn.query({ sql, namedPlaceholders: true }, namedValues, (err: Error | null, results: any[]) => {
                conn.release();
                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    });
}

export default runQuery;
