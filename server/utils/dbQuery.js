import db from "../config/database.js"

export function dbQuery(sql, values = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) reject(err)
            else resolve(results)
        })
    })
}
