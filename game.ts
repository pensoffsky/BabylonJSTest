///<reference path="babylon.d.ts" />

class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;


    constructor(canvasElement: string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);

        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this._scene);
    
         // Create a basic light, aiming 0,1,0 - meaning, to the sky.
         this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);
    }

    createScene(): void {
        this._scene.debugLayer.show();
        //this._scene.ambientColor = new BABYLON.Color3(1,1,1);

        this._scene.gravity = new BABYLON.Vector3(0, -9, 0);
        this._scene.collisionsEnabled = true;

        // Target the camera to scene origin.
        this._camera.setTarget(BABYLON.Vector3.Zero());

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);

       

        var spotLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(10,1,1), this._scene);

        // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
            { segments: 16, diameter: 2 }, this._scene);

        // Move the sphere upward 1/2 of its height.
        sphere.position.y = 1;

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this._scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

        let box = BABYLON.MeshBuilder.CreateBox("box", {}, this._scene); 
        box.position.y = 2;
        box.position.x = -5;
        box.material = myMaterial;
        

        var animationBox = new BABYLON.Animation("myAnimation", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // An array with all animation keys
        var keys = []; 
        keys.push({
            frame: 0,
            value: -5
        });
        keys.push({
            frame: 60,
            value: 0
        });
        keys.push({
            frame: 1000,
            value: 5
        });
        animationBox.setKeys(keys);
        box.animations = [animationBox];
        var anim = this._scene.beginAnimation(box, 0, 1000, false);

        // Create a built-in "ground" shape.
        // let ground = BABYLON.MeshBuilder.CreateGround('ground1',
        //     { width: 6, height: 6, subdivisions: 2 }, this._scene);

        // Default Environment - adds a skybox and a ground
        var environment = this._scene.createDefaultEnvironment({ 
            enableGroundShadow: true,
            groundYBias: 1 
        });
        if(environment === null) {
            return;
        }
        environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"));

        var cornellBox = BABYLON.SceneLoader.ImportMesh(
            "",
            "https://models.babylonjs.com/CornellBox/",
            "cornellBox.glb",
            this._scene);

        // Enable VR
        var vrHelper = this._scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
        vrHelper.enableTeleportation({floorMeshes: [environment.ground!]});
    }


    doRender(): void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        // The canvas/window resize event handler.
        window.addEventListener('click', () => {
            var pickResult = this._scene.pick(this._scene.pointerX, this._scene.pointerY);
            if( pickResult && pickResult.hit ) {
                console.log(pickResult.pickedMesh!.name);
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Game('renderCanvas');

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.doRender();
});