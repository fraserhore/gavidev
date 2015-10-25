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
		
		var query = 'MATCH (a)-[version:VERSION]->(b) WHERE id(a) = {id} AND version.to = 9223372036854775807 AND version.lang = "en-gb" RETURN a as IdentityNode, version as Version, b as VersionNode'
		var params = {
			"resultDataContents" : [ "row", "graph" ],
			"id": parseInt(req.param('id'))
		}
		var isDefined = function(value, path) {
			  path.split('.').forEach(function(key) { value = value && value[key]; });
			  return (typeof value != 'undefined' && value !== null);
			};
		var cb = function(err,data) { 
			//return res.json(data.results);
			var row = data.results && data.results[0] && data.results[0].data && data.results[0].data[0] && data.results[0].data[0].row,
				object = {};
			object['identityNode'] = row && row[0];
			object['versionNode'] = row && row[2];
			object['layout'] = '';
			return res.view("full", object);
		}
		cypher(query,params,cb);
  }
};

