proc-stats
----------

library for getting memory and cpu usage for windows, mac or linux - other os's are not supported. No production dependancies or compilation needed :)

look at the unit tests to see how it is used. remember - you can pull out basic process memory stuff (rss, heapTotal, heapUsed) using process.memoryUsage() - this gives you the % CPU usage per process, and if you are using linux the vsize

usage:
------
npm install proc-stats

```javascript

var procStats = require('proc-stats');

procStats.stats(function(e, result){
	/*
	  linux:
	  result looks like { memory: 25751552, // resident set size
	  memoryInfo: 
	  { rss: 25751552, // resident set size
	  	vsize: 3123171328 }, //virtual set size
	  cpu: 1.6 } //CPU USAGE

	  windows:
	  result looks like { memory: 23486464,
  		memoryInfo: { rss: 23486464, // resident set size
  						heapTotal: 16486912, 
  						heapUsed: 9636688 },
  		cpu: 0 }//CPU USAGE
	*/
});

```

thanks to Kyll Ross for the windows stuff, https://github.com/KyleRoss/windows-cpu


