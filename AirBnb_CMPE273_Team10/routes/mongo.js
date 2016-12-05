var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var option = {
		server: {
		    poolSize : 40
		}
	};

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, option,function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};


exports.getConnection = function(url, callback){
	if(db){
		console.log("old conn");
		callback(db);
	}else{
		console.log("new conn");
		MongoClient.connect(url,option, function(err, _db){
			  if (err) { throw new Error('Could not connect: '+err); }
			   	  db = _db;
			      connected = true;
			      console.log(connected +" is connected?");
			      callback(db);
			  });

	}
	};


/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};