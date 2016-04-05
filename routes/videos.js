//This is where we get data from the database.
//And create API endpoints
var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vidzy');             //Open db connection and selects the vidzy db

router.get('/', function(req, res) {
    var collection = db.get('videos');              //Gets the videos table/collection
    collection.find({}, function(err, videos){      // equivelent to Select all from videos
        if (err) throw err;
      	res.json(videos);                           // Returns a json object to the response
    });
});

router.post('/', function(req, res){                //HTTP POST is the REST convention for creating new objects
    var collection = db.get('videos');              //Gets the video collection/table
    collection.insert({                             //Inserting a new document/row
        title: req.body.title,                      //Req.body this obj represents the data that will be posted in the body if the request
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);                             //Returns the json represention of the new video document/row
    });
});

router.get('/:id', function(req, res) {             //You can access the value of GET param :id using req.params.id
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){        //findOne = Selecing one Document where the _id is equal to req.params.id
        if (err) throw err;

      	res.json(video);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('videos');
    collection.update({                             //Update without overwritting 
        _id: req.params.id                          //Where _id = GET's id   
    },
    {                                               //Updating values
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

router.delete('/:id', function(req, res){                               //HTTP delete request
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

module.exports = router;