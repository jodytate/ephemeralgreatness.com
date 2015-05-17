(function () {

  'use strict';

  var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  var scene = new THREE.Scene();

  var composer;

  var object = new THREE.Object3D();
  var light = new THREE.DirectionalLight( 0xFFFFFF);
  var glitchPass = new THREE.GlitchPass();

  var wildGlitch = document.getElementById('wildGlitch');

  var updateOptions = function updateOptions () {
    glitchPass.goWild = wildGlitch.checked;
  };

  wildGlitch.addEventListener('change', function () {
    updateOptions();  
  });

  var geometry = new THREE.SphereGeometry( 1, 4, 4 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );

  var init = function init() {

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    camera.position.z = 400;
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
    scene.add( object );



    for ( var i = 0; i < 100; i ++ ) {
      // material needs defining in this scope or its black and white
      // and randomize colors
      material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random(), shading: THREE.FlatShading } );

      // mesh needs defining in this scope or it's one item
      // http://en.wikipedia.org/wiki/Polygon_mesh
      var mesh = new THREE.Mesh( geometry, material );
      
      mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
      mesh.position.multiplyScalar( Math.random() * 400 );
      mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
      object.add( mesh );

    }

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light.position.set( 1, 1, 1 );
    scene.add( light );

    // postprocessing

    // composer needs defining in this scope or it's not a sharp image
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass( glitchPass );


    window.addEventListener( 'resize', onWindowResize, false );

    updateOptions();

  };

  var onWindowResize = function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );


  };

  var animate = function animate() {

    requestAnimationFrame( animate );

    var time = Date.now();

    object.rotation.x += 0.005;
    object.rotation.y += 0.01;

    composer.render();
    //renderer.render(scene, camera);

  };

  init();
  animate();

}());
