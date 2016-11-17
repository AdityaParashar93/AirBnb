/**
 * New node file
 */
var loginDatabase = "mongodb://localhost:27017/demodb";
var mongo = require('./mongo');

mongo.connect(loginDatabase,function(){
	
	var newFileName = "my-image";
	File imageFile = new File("/users/victor/images/image.png");
	GridFS gfsPhoto = new GridFS(db, "photo");
	GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
	gfsFile.setFilename(newFileName);
	gfsFile.save();

	
});
