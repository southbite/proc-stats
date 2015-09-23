var os = require('os');
var platform = os.platform();
var util = require('util');

module.exports = {
	wincpu:null,
	getMemoryUsage:function(){
		var _memoryUsage = process.memoryUsage();

		return {
			memory: _memoryUsage.rss,
			memoryInfo:{
				rss: _memoryUsage.rss,
				heapTotal:_memoryUsage.heapTotal,
				heapUsed:_memoryUsage.heapUsed
			}
		};
	},
	parseWinPS:function(val){
		var memoryUsage = this.getMemoryUsage();

		console.log('windows memoryUsage', memoryUsage);

		memoryUsage.cpu = val.load;

		return memoryUsage;
	},
	parsePS:function(pid, output) {

	  var lines = output.trim().split('\n');
	  if (lines.length !== 2) {
	    throw new Error('INVALID_PID');
	  }

	  var matcher = /[ ]*([0-9]*)[ ]*([0-9]*)[ ]*([0-9\.]*)/;
	  var result = lines[1].match(matcher);

	  if(result) {
	    return {
	      memory: parseInt(result[1]) * 1024,
	      memoryInfo: {
	        rss: parseFloat(result[1]) * 1024,
	        vsize: parseFloat(result[2]) * 1024
	      },
	      cpu: parseFloat(result[3])
	    };
	  } else {
	    throw new Error('PS_PARSE_ERROR');
	  }
	},
	stats:function(params, callback){

		var _this = this;

		if (typeof params === 'function')
			callback = params;

		var pid = params.pid;

		if (!pid)
			pid = process.pid;

		if (platform == 'win32'){

			if (!_this.wincpu)
				_this.wincpu = require('windows-cpu');

			return _this.wincpu.findLoad(pid, function(error, results) {
			     if(error) 
			         return callback(error);
			    
			     callback(null, _this.parseWinPS(results));

			});

		}else{

			var exec = require('child_process').exec;
			exec('ps -o "rss,vsize,pcpu" -p ' + pid, function(err, stdout, stderr) {
		      if (err || stderr) return callback(err || stderr);

		      try {
		        callback(null, _this.parsePS(pid, stdout));
		      } catch(ex) {
		        callback(ex);
		      }
		    });

		}
	}
}
