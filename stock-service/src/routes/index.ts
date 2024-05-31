import { Express } from 'express'
import routerStock from './stock/stock'

const setRoutePaths = (app: Express) => {
    app.get('/', (req, res) => {
        res.status(200).send('Check... README.md file to be aware of Stock Service Contract')
    })

    app.use('/stock', routerStock)
}
export default setRoutePaths
