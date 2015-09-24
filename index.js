var os = require('os');
var platform = os.platform();
var exec = require('child_process').exec;

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
	parseWindowsPS:function(output, memoryUsage){

		var found = output.replace(/[^\S\n]+/g, ':').replace(/\:\s/g, '|').split('|').filter(function(v) {
            return !!v;
        }).map(function(v) {
            var data = v.split(':');
            return {
                pid: +data[0],
                process: data[1],
                load: +data[2]
            };
        });
        
        var totalLoad = 0;
        
        found.forEach(function(obj) {
            totalLoad += obj.load;
        });
        
        memoryUsage.cpu = totalLoad;
        
		return memoryUsage;
	},
	parsePS:function(output, memoryUsage) {

	  var lines = output.trim().split('\n');
	  if (lines.length !== 2) {
	    throw new Error('INVALID_PID');
	  }

	  var matcher = /[ ]*([0-9]*)[ ]*([0-9]*)[ ]*([0-9\.]*)/;
	  var result = lines[1].match(matcher);

	  if(result) {

	  	memoryUsage.memoryInfo.vsize = parseFloat(result[2]) * 1024;
	  	memoryUsage.cpu = parseFloat(result[3]);

	  	return memoryUsage;

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

		var memoryUsage = this.getMemoryUsage();

		if (platform == 'win32'){

			var cmd = "wmic path Win32_PerfFormattedData_PerfProc_Process get Name,PercentProcessorTime,IDProcess | findstr /i /c:" + pid;
	        exec(cmd, function (error, stdout, stderr) {
	            if(error !== null || stderr) return callback(error || stderr);
	            if(!stdout) return callback('Cannot find results for provided arg: ' + pid, { load: 0, results: [] });
	            
	            callback(null, _this.parseWindowsPS(stdout, memoryUsage));
	        });

		}else{

			exec('ps -o "rss,vsize,pcpu" -p ' + pid, function(err, stdout, stderr) {
		      if (err || stderr) return callback(err || stderr);

		      try {
		        callback(null, _this.parsePS(stdout, memoryUsage));
		      } catch(ex) {
		        callback(ex);
		      }
		    });

		}
	}
}
