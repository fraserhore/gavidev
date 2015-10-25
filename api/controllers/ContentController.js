/**
 * ContentController
 *
 * @description :: Server-side logic for managing contents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `ContentController.view()`
   */
  view: function (req, res) {
		var r=require("request");
		var username = 'GaviGraph';
		var	password = 'DNWxlYkxIFzktTxSDGGS';
		var txUrl = "http://" + username + ":" + password + "@gavigraph.sb06.stations.graphenedb.com:24789/db/data/transaction/commit";

		function cypher(query,params,cb) {
			r.post({uri:txUrl,
							json:{statements:[{statement:query,parameters:params}]}},
						 function(err,res) { cb(err,res.body)})
		}
		
		var query = "MATCH (identitynode)-[currentrelationship:CURRENT]->(currentversion) WHERE id(identitynode)={id} RETURN identitynode,currentrelationship,currentversion" 
		var params = {
			"resultDataContents" : [ "row", "graph" ],
			"id": parseInt(req.param('id'))
		}
		var cb = function(err,data) { 
			//return res.json(data.results);
			return res.view("full", {
			identityNode: data.results[0].data[0].row[0],
			versionNode: data.results[0].data[0].row[2],
				layout: ''
			});
		}
		cypher(query,params,cb);
  }
};

