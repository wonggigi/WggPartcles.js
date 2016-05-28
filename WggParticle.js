var Particle = (function() {
	var instance = null;
	var System = function(ctx, config) {
		this.ctx = ctx;
		this.width = ctx.canvas.offsetWidth;
		this.height = ctx.canvas.offsetHeight;

		/* Particle Configure */
		this.speed = config.speed;
		this.maxParticleRadius = config.maxParticleRadius || 10;
		this.minParticleRadius = config.minParticleRadius || 4;

		/*System Configure*/
		this.linkNum = config.linkNum || 2;
		this.color = config.color || "white";
		this.particleNum = config.particleNum || 400;
		this.distance = config.distance || 100;

		/*Content Configure*/
		if (config.content) {
			this.particleContent = config.content.content;
			this.contentNum = config.content.num;
		}
	}
	System.prototype.render = function() {
		var ctx = this.ctx;
		ctx.translate(0, this.height);
		ctx.scale(1, -1);
		ctx.fillStyle = "#adadad";
		ctx.fillRect(0, 0, this.width, this.height);

		var model = [];
		/*create particles*/
		for (var i = 0; i < this.particleNum; i++) {
			var x = Math.floor(Math.random() * (this.width));
			var y = Math.floor(Math.random() * (this.height));
			var k = Math.random()>0.5?Math.random():-Math.random();
			var b = Math.floor(Math.random() * (this.height*2) - this.height);

			var direction = Math.random() > 0.5 ? true : false;
			
			model.push({
				x: x,
				k: k,
				b: b,
				direction: direction
			})
		}
		var animation = function(argument) {
			ctx.clearRect(0, 0, this.width, this.height);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, this.width, this.height);
			for (var i = 0; i < model.length; i++) {
				if (model[i].direction) {
					model[i].x += 0.3;
				} else {
					model[i].x -= 0.3;
				}
				var y = model[i].x * model[i].k + model[i].b;
				
				if (model[i].x<0) {
					model[i].x=this.width;
				}else if (model[i].x>this.width) {
					model[i].x=0;
				}/*else if (y>this.height&&model[i].direction) {
					model[i].x=0;
				}else if (y<0&&!model[i].direction) {
					model[i].x=this.width;
				}else if(y<0&&model[i].direction){
					model[i].x=-model[i].b/model[i].k
				}else if (y>this.height&&!model[i].direction) {
					model[i].x=(this.height-model[i].b)/model[i].k
				}*/

				var linkNum = 0;
				for (var j = 0; j < model.length; j++) {
					if (i != j) {
						var y1 = model[i].x * model[i].k + model[i].b;
						var y2 = model[j].x * model[j].k + model[j].b;
						var x1 = model[i].x;
						var x2 = model[j].x;
						var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
						if (distance < this.distance && linkNum < this.linkNum) {
							ctx.beginPath();
							ctx.moveTo(x1, y1);
							ctx.lineTo(x2, y2);
							ctx.globalAlpha = 1 - (distance / this.distance);
							ctx.strokeStyle = this.color;
							ctx.stroke();
							ctx.closePath();

		
							ctx.beginPath();
							ctx.arc(model[i].x, y, 4, 0, 360, false);
							ctx.fillStyle = this.color;
							ctx.fill();
							ctx.globalAlpha = 1;


						}
					}
				}
			}

		}.bind(this)
		setInterval(animation, 10)
	}
	var init = function(ctx, jsonConfig) {
		var canvas = ctx.canvas;
		canvas.setAttribute("width", canvas.parentNode.offsetWidth);
		canvas.setAttribute("height", canvas.parentNode.offsetHeight);
		instance = new System(ctx, jsonConfig);
		instance.render()
	}
	return {
		render: init
	}
})()