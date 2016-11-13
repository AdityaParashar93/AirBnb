var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback) {
	MongoClient.connect(url, function(err, _db) {
		if (err) {
			throw new Error('COULD NOT CONNECT: ' + err);
		}
		db = _db;
		connected = true;
		callback(db);
	});
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name) {
	if (!connected) {
		throw new Error('MUST CONNECT TO MONGO BEFORE CALLING A "collection"');
	}
	return db.collection(name);

};