var express = require('express');
var donor = require('../app/models/donor');
var path = require('path');
var router = express.Router();

router.get('/',function(req, res) {
	res.sendFile('index.html', {root: path.join(__dirname, "../public")});
});

router.get('/data', function(req, res) {
// use mongoose to fetch data from db
	donor.find({}, 
		{'_id': 0, 'school_state': 1, 'resource_type': 1, 'poverty_level': 1, 
		'date_posted': 1, 'total_donations': 1, 'funding_status': 1, 'grade_level': 1}, 
		function(err, subjectDetails) {
	   if (err) {
	   	res.send(err);
	   } else {
			res.json(subjectDetails); 
	   }
  });
});
module.exports = router;