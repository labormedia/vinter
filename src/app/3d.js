
/*******************************************************************

	ThreeJS demo
	--
	based on a factory demo, with some applied post processing

********************************************************************/

var ThreeDemo = {
	windowHalfX: window.innerWidth / 2,
	windowHalfY: window.innerHeight / 2,
	renderer: null,
	camera: null,
	tanFOV: null,
	scene: null,
	container: (function() { return document.querySelector('.app')})(),
	innerHeight : (function() { return window.innerHeight })(),
	headerSize: 350,

	xMod: 0, // Connection to the riot UI
	yMod: 0, // updating these values 
	zMod: 0, // will change camera position

	init: function() {
		var container, separation = 100, amountX = 50, amountY = 50,
		particles, particle;
		// container = document.querySelector('.app');

		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.z = 100;

		this.tanFOV = Math.tan( ( ( Math.PI / 180 ) * this.camera.fov / 2 ) );

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.container.offsetWidth, window.innerHeight-this.headerSize );
		this.container.appendChild( this.renderer.domElement );

		this.container.addEventListener('dblclick', this.fullscreen, false);

		// particles
		var PI2 = Math.PI * 2;
		var material = new THREE.MeshPhongMaterial( { color: 0xffff00, shading: THREE.FlatShading } );

		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 100; i ++ ) {
			particle = new THREE.Sprite( material );
			particle.position.x = Math.random() * 2 - 1;
			particle.position.y = Math.random() * 2 - 1;
			particle.position.z = Math.random() * 2 - 1;
			particle.position.normalize();
			particle.position.multiplyScalar( Math.random() * 10 + 450 );
			particle.scale.x = particle.scale.y = 10;
			this.scene.add( particle );

			geometry.vertices.push( particle.position );
		}

		// lines
		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
		this.scene.add( line );

		//
		window.addEventListener( 'resize', this.onWindowResize, false );

		// postprocessing
		composer = new THREE.EffectComposer( this.renderer );
		composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

		glitchPass = new THREE.GlitchPass();
		glitchPass.renderToScreen = true;
		composer.addPass( glitchPass );

		this.animate();
	},

	onWindowResize: function() {
		// console.log(window.innerWidth / window.innerHeight);
			ThreeDemo.camera.aspect = 1;
		// ThreeDemo.camera.fov = ( 360 / Math.PI ) * Math.atan( ThreeDemo.tanFOV * ( window.innerHeight / window.innerHeight ) );

		if (!isfullscreen) {
			var canvas = document.getElementsByTagName('canvas');
			// if (canvas) canvas[0].parentElement.removeChild(canvas[0]);

			canvas[0].setAttribute("style", "position: static;");
			ThreeDemo.camera.aspect = window.innerWidth / window.innerHeight;
			ThreeDemo.camera.updateProjectionMatrix();
			ThreeDemo.renderer.setSize( ThreeDemo.container.offsetWidth, ThreeDemo.container.offsetHeight ); 
		} else {
			var canvas = document.getElementsByTagName('canvas');
			// if (canvas) canvas[0].parentElement.removeChild(canvas[0]);

			canvas[0].setAttribute("style", "position:absolute; display:block; top:0; left: 0 ;width:100%;height:100%; z-index:1000;");
			ThreeDemo.camera.aspect = canvas[0].offsetWidth / canvas[0].offsetHeight;
			ThreeDemo.camera.updateProjectionMatrix();
			ThreeDemo.renderer.setSize( canvas[0].offsetWidth, canvas[0].offsetHeight );
		}

	},

	fullscreen: function () {
		// console.log(ThreeDemo.container);
		var canvas = document.getElementsByTagName('canvas');
		if (ThreeDemo.isfullscreen == 0) {
			// ThreeDemo.renderer.setSize(100,100);

			// if (canvas) canvas[0].parentElement.removeChild(canvas[0]);
			canvas[0].setAttribute("style", "position:absolute; display:block; top:0; left: 0 ;width:100%;height:100%; z-index:1000;");
			ThreeDemo.renderer.setSize( canvas[0].offsetWidth, canvas[0].offsetHeight );
		} else {
				canvas[0].setAttribute("style", "position: static;");
				ThreeDemo.renderer.setSize( ThreeDemo.container.offsetWidth, ThreeDemo.container.offsetHeight+500);
		}
		ThreeDemo.onWindowResize;
		ThreeDemo.isfullscreen = !ThreeDemo.isfullscreen;
		// console.log(ThreeDemo.isfullscreen)
		console.log(ThreeDemo.innerHeight)
	},

	isfullscreen: false,

	animate: function() {
		requestAnimationFrame( this.animate.bind(this) );
		this.render();
	},

	render: function() {
		this.camera.position.x += ( this.xMod - this.camera.position.x ) * .05;
		this.camera.position.y += ( -this.yMod - this.camera.position.y ) * .05;
		this.camera.position.z += ( this.zMod - this.camera.position.z ) * .05;
		this.camera.lookAt( this.scene.position );

		composer.render();
	}
}