(function() {

	var
	math = {
		floorTo: function(number, to) {
		
			return (Math.floor(number*to)/to);
		
		}
	},
	time = {
		get: function() {

			return new Date().getTime();

		}
	},
	array = {
		each: function(collection, callback) {

			var 
			count = collection.length,
			loop = 0,
			value;
			
			while(loop<count) {
				value = callback(collection[loop], loop);
				if(value==="break") {
					break;
				};
				loop ++;
			};
			
			return collection;

		}
	},
	node = {
		get: function(id) {
			
			return document.getElementById(id);

		},
		create: function(name) {

			return $(document.createElement(name));

		}
	},
	key = {
		space: 32
	},
	bpm = {
		start: function() {

			console.log("bpm.start();");

			this.started = true;
			this.startTime = time.get();

			return this;

		},
		stop: function() {

			console.log("bpm.stop();");

			this.started = false;
			this.reset();

			return this;

		},
		reset: function() {

			this.beats = 0;

			return this;

		},
		count: function() {

			if(!this.started) {
				this.start();
			};

			this.beats ++;

			clearTimeout(this.timer);

			this.timer = setTimeout(function() {

				bpm.stop();

			}, (this.timeout*1000));

			return this;

		},
		get: function() {

			var
			duration = (time.get()-this.startTime),
			out,
			beats = this.beats,
			beatsDivider = this.timeSignatures[this.timeSignature][1];

			if(beats===1) {
				duration = 1000;
			}
			else {
				beats --;
			};

			beats = (beats/beatsDivider);
			out = math.floorTo(beats*(60000/duration), 1);

			return out;

		},
		timeSignatures: [
			["2/4", 1],
			["3/4", 1],
			["4/4", 1],
			["6/8", 2],
			["9/8", 2],
			["12/8", 2]
		],
		timeSignature: 2,
		started: false,
		startTime: null,
		beats: 0,
		timeout: 3,
		timer: null
	},
	inNode = node.get("in"),
	outNode = node.get("out"),
	timeSignatureSelect = node.create("select"),
	handle = function() {

		bpm.count();
		outNode.innerHTML = bpm.get();

	};

	document.addEventListener("keydown", function(e) {

		if(!(e.keyCode===key.space)) {
			return;
		};

		handle();
		e.preventDefault();

	});

	inNode.addEventListener("mousedown", function(e) {

		handle();
		e.preventDefault();

	});

	array.each(bpm.timeSignatures, function(item, index) {

		node.create("option").html(item[0]).attr("value", index).appendTo(timeSignatureSelect);

	});

	timeSignatureSelect.val(bpm.timeSignature).bind("change", function() {

		bpm.timeSignature = Number(timeSignatureSelect.val());

	}).appendTo("#time");

})();