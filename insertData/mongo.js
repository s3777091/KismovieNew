const mongoose = require('mongoose');
const mongoPath = 
'mongodb+srv://dathuynh1909:Dathuynh1909@realmcluster.92c3m.mongodb.net/<dbname>?retryWrites=true&w=majority'


module.exports = async() => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    return mongoose
}