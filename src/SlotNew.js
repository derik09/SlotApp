class SlotNew {

    createCanvasWithReels = () => {
        let app = new PIXI.Application({ width: 900, height: 480 });
        
        app.renderer.backgroundColor = 0xFFFFFF;
        document.body.appendChild(app.view);

        PIXI.loader
            .add("../src/assets/apple.png")
            .add("../src/assets/banana.png")
            .add("../src/assets/melon.png")
            .load(setup);

        //This setup function will run when the image has loaded
        function setup() {
            let apple = new PIXI.Sprite(PIXI.loader.resources["../src/assets/apple.png"].texture);
            apple.position.set(24, 96);
            let banana = new PIXI.Sprite(PIXI.loader.resources["../src/assets/banana.png"].texture);
            banana.position.set(320, 96);
            let melon = new PIXI.Sprite(PIXI.loader.resources["../src/assets/melon.png"].texture);
            melon.position.set(620, 96);

            let reel = new PIXI.Container();

            reel.addChild(apple);
            reel.addChild(banana);
            reel.addChild(melon);

            app.stage.addChild(reel);


            const spinBtn = new PIXI.Graphics();
            spinBtn.position.set(400, 300);

            const style = new PIXI.TextStyle({
                fontFamily: 'Open Sans',
                fontSize: 40,
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#b7b7b7',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440,
            });

            const spinText = new PIXI.Text('Spin', style);
            spinText.x = 0;
            spinText.y = 100;
            spinBtn.addChild(spinText);

            spinBtn.interactive = true;
            spinBtn.buttonMode = true;
            spinBtn.addListener('pointerdown', () => {
                startSpin();
            });

            app.stage.addChild(spinBtn);

            function startSpin() {
                animate();

                let coords = { x: 0, y: 0 };

                //Use of tween.js to enable tweening
                let tween;
                tween = new TWEEN.Tween(coords)
                    .to({ x: 0, y: 600 }, 300)      //move from x:0 to y:600 in 0.3 secs
                    .repeat(2)
                    .onUpdate(function () {
                        reel.position.set(coords.x, coords.y);
                    })
                    .onComplete(function () {
                        let symbols = localStorage.getItem("symbolGrid");
                        reel.position.set(0, 0);

                        reel.removeChildren(0);

                        let symbol = symbols.split(',')
                        console.log(symbol);
                        for (let position in symbol) {
                            switch (Number(symbol[position])) {
                                case 0:
                                    switch (Number(position)) {
                                        case 0:
                                            let apple1 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/apple.png"].texture);
                                            addImage(apple1, 24, 96);
                                            break;
                                        case 1:
                                            let apple2 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/apple.png"].texture);
                                            addImage(apple2, 320, 96);
                                            break;
                                        case 2:
                                            let apple3 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/apple.png"].texture);
                                            addImage(apple3, 620, 96);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case 1:
                                    switch (Number(position)) {
                                        case 0:
                                            let banana1 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/banana.png"].texture);
                                            addImage(banana1, 24, 96);
                                            break;
                                        case 1:
                                            let banana2 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/banana.png"].texture);
                                            addImage(banana2, 320, 96);
                                            break;
                                        case 2:
                                            let banana3 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/banana.png"].texture);
                                            addImage(banana3, 620, 96);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case 2:
                                    switch (Number(position)) {
                                        case 0:
                                            let melon1 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/melon.png"].texture);
                                            addImage(melon1, 24, 96);
                                            break;
                                        case 1:
                                            let melon2 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/melon.png"].texture);
                                            addImage(melon2, 320, 96);
                                            break;
                                        case 2:
                                            let melon3 = new PIXI.Sprite(PIXI.loader.resources["../src/assets/melon.png"].texture);
                                            addImage(melon3, 620, 96);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    })
                    .start();
            }

            function addImage(fruit, x, y) {
                fruit.position.set(x, y);
                reel.addChild(fruit);
            }

            //On click of start button call fetch api
            function animate() {
                let stake = document.getElementById('stakeSelector').value;

                doFetch('<Request balance=\"100.00\" stake=\" '+ stake +'\" />',
                    'http://localhost:8888/serve');        //had to change this from localhost to ip address of local docker server
            }

            function doFetch(Content, URL) {
                const fetchPromise = fetch(
                    URL, {
                    method: 'POST',
                    //mode: 'no-cors',
                    headers: new Headers(
                        {
                            'Content-Type': 'text/xml; charset=utf-8',
                            'Accept': '*/*',
                            'Accept-Language': 'en-GB',
                            'Accept-Encoding': 'gzip, deflate',
                            'Connection': 'Keep-alive',
                            'Content-Length': Content.length
                        }),
                    body: Content
                });


                return fetchPromise
                    .then(response => response.text())
                    .then(str => {
                        if (str.includes("Error")) {
                            throw Error(str);
                        }
                        return (new window.DOMParser()).parseFromString(str, "text/xml");
                    })
                    .then(data => {
                        let slot = data.getElementsByTagName("SymbolGrid");
                        let winnings = data.getElementsByTagName("Response");
                        if (winnings.length != 0) {
                            document.getElementById("balance").innerText = "Balance : " + winnings[0].attributes[0].value;
                            document.getElementById("stake").innerText = "Stake : " + winnings[0].attributes[1].value;
                            document.getElementById("win").innerText = "Win : " + winnings[0].attributes[2].value;
                        }

                        let strArr = [];
                        for (let i = 0; i < slot.length; i++) {
                            let arr = slot[i].attributes[1].value.split(',');
                            let fst = arr.splice(0, 1);
                            switch (Number(fst)) {
                                case 0:
                                    strArr.push('0');
                                    break;
                                case 1:
                                    strArr.push('1');
                                    break;
                                case 2:
                                    strArr.push('2');
                                    break;
                                default:
                                    break;
                            }
                        }

                        localStorage.setItem("symbolGrid", strArr);
                    })
                    .catch(error => {
                        alert(error);
                    });
            }

            //Event listener to update the tween
            app.ticker.add(delta => {
                gameLoop();
            });
        }

        function gameLoop() {
            TWEEN.update(app.ticker.lastTime);
        }
    }
}
export { SlotNew };