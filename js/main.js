
// particle.js
particlesJS("particles-js", {
		  "particles": {
		    "number": {
		      "value": 355,
		      "density": {
		        "enable": true,
		        "value_area": 789.1476416322727
		      }
		    },
		    "color": {
		      "value": "#ffffff"
		    },
		    "shape": {
		      "type": "circle",
		      "stroke": {
		        "width": 0,
		        "color": "#000000"
		      },
		      "polygon": {
		        "nb_sides": 5
		      },
		      "image": {
		        "src": "img/github.svg",
		        "width": 100,
		        "height": 100
		      }
		    },
		    "opacity": {
		      "value": 0.48927153781200905,
		      "random": false,
		      "anim": {
		        "enable": true,
		        "speed": 0.2,
		        "opacity_min": 0,
		        "sync": false
		      }
		    },
		    "size": {
		      "value": 2,
		      "random": true,
		      "anim": {
		        "enable": true,
		        "speed": 2,
		        "size_min": 0,
		        "sync": false
		      }
		    },
		    "line_linked": {
		      "enable": false,
		      "distance": 150,
		      "color": "#ffffff",
		      "opacity": 0.4,
		      "width": 1
		    },
		    "move": {
		      "enable": true,
		      "speed": 0.2,
		      "direction": "none",
		      "random": true,
		      "straight": false,
		      "out_mode": "out",
		      "bounce": false,
		      "attract": {
		        "enable": false,
		        "rotateX": 600,
		        "rotateY": 1200
		      }
		    }
		  },
		  "interactivity": {
		    "detect_on": "canvas",
		    "events": {
		      "onhover": {
		        "enable": true,
		        "mode": "bubble"
		      },
		      "onclick": {
		        "enable": true,
		        "mode": "push"
		      },
		      "resize": true
		    },
		    "modes": {
		      "grab": {
		        "distance": 400,
		        "line_linked": {
		          "opacity": 1
		        }
		      },
		      "bubble": {
		        "distance": 83.91608391608392,
		        "size": 1,
		        "duration": 3,
		        "opacity": 1,
		        "speed": 3
		      },
		      "repulse": {
		        "distance": 200,
		        "duration": 0.4
		      },
		      "push": {
		        "particles_nb": 4
		      },
		      "remove": {
		        "particles_nb": 2
		      }
		    }
		  },
		  "retina_detect": true
		});
		// text fly
		// const text = document.querySelector('.text-fly');
		// text.innerHTML = text.textContent.replace(/\S/g,"<span>$&</span>");

		// const animation = anime.timeline({
		// 	targets : '.text-fly span' ,
		// 	easing : 'easeInOutExpo',
		// 	loop : true,
		// });
		// animation 
		// 	.add({
		// 	rotate: function(){
		// 	return anime.random(-360,360)
		// 	},
		// 	translateX: function(){
		// 	return anime.random(-500, 500)
		// 	},
		// 	translateY : function(){
		// 	return anime.random(-500, 500)},
		// 	duration : 5000,
		// 	delay : anime.stagger(20),
		// 	})
		// 	.add({
		// 	rotate: 0,
		// 	translateX: 0,
		// 	translateY : 0,
		// 	delay : anime.stagger(20),
		// 	})


			