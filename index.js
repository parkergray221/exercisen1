const express = require('express')
const path = require('path')
const mongodb = require('mongodb')
const PORT = process.env.PORT || 8000
const app = express();


app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//**************************************************************************
//***** mongodb get all of the Routes in Routes collection where frequence>=1
//      and sort by the name of the route.  Render information in the views/pages/mongodb.ejs
app.get('/mongodb', function (request, response) {
                             
     mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
         if(err) throw err;

          //get collection of routes
          var Routes = db.collection('Routes');

          //get all Routes with frequency >=1
          Routes.find({ frequency : { $gte: 1 } }).sort({ name: 1 }).toArray(function (err, docs) {

              if(err) throw err;
                               
              response.render('pages/mongodb', {results: docs});
   
          });
   
           //close connection when your app is terminating.
            db.close(function (err) {
                     if(err) throw err;
             });

 });//end of connect

});//end app.get

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

